import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, map, tap } from 'rxjs';
import * as TINY_URL_CONSTANT from './tiny-url.constant';
import * as USER_CONSTANT from 'src/app/user.constant';
import { urlValidator } from 'src/app/shared/validators/url.validator';
import { TinyUrlService } from './tiny-url.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-tiny-url',
  templateUrl: './tiny-url.component.html',
  styleUrls: ['./tiny-url.component.css'],
  providers: [TinyUrlService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TinyUrlComponent {
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _tinyUrlService = inject(TinyUrlService);
  private readonly _userService = inject(UserService);
  urlEntryFormGroup!: FormGroup;
  TINY_URL_CONSTANT = TINY_URL_CONSTANT;
  private readonly _user$ = this._userService.user$;
  private readonly _tinyUrlMapping$ = this._tinyUrlService.tinyUrlMapping$;
  private readonly _currentTinyUrlMap$ = this._tinyUrlService.currentTinyUrlMap$.pipe(
    tap((currentTinyUrlMap) => this.currentTinyUrl = currentTinyUrlMap?.tinyUrl),
    tap((currentTinyUrlMap) => this.urlEntryFormGroup.patchValue({ tinyUrl: currentTinyUrlMap?.tinyUrl })),
  );
  viewData$ = combineLatest([this._user$, this._tinyUrlMapping$, this._currentTinyUrlMap$]).pipe(
    map(([user, tinyUrlMapping, currentTinyUrlMap]) => ({ user, tinyUrlMapping, currentTinyUrlMap }))
  );
  currentTinyUrl!: string | null;

  tinyUrlAlreadyExists = false;

  constructor() {
    this.createUrlEntryForm();
  }

  copyToClipboard(): void {
    if (typeof this.currentTinyUrl === 'string' && this.currentTinyUrl.length > 0) {
      navigator.clipboard.writeText(this.currentTinyUrl)
        .then(() => {
          console.log('URL copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy URL: ', err);
        });
    } else {
      console.error('No URL to copy');
    }
  }

  createUrlEntryForm(): void {
    this.urlEntryFormGroup = this._fb.group({
      url: ['abc.com', { validators: [Validators.required, Validators.maxLength(TINY_URL_CONSTANT.URL_MAX_LENGTH), urlValidator] }],
      alias: ['', { validators: [Validators.maxLength(TINY_URL_CONSTANT.ALIAS_MAX_LENGTH)] }],
      tinyUrl: ['']
    });
  }

  onSubmit(): void {
    try {
      this._tinyUrlService.createTinyUrl(this.urlEntryFormGroup.value);
    } catch (error) {
      console.error('momo' + error);
      this.tinyUrlAlreadyExists = true;
    }
  }

  login(): void {
    this._userService.login({ userName: USER_CONSTANT.USER_NAME, email: 'megabyzus@gmail.com', password: '24365243!@#' });
  }

  deleteTinyUrl(): void {
    if (this.currentTinyUrl) {
      this._tinyUrlService.deleteTinyUrl(this.currentTinyUrl);
      this.tinyUrlAlreadyExists = false;
    }
  }

  statsTinyUrl(): void {
    throw new Error('Method not implemented.');
  }

  goToUrl(): void {
    if (typeof this.currentTinyUrl === 'string' && this.currentTinyUrl) {
      this._tinyUrlService.goToUrl(this.currentTinyUrl);
    }
  }
}
