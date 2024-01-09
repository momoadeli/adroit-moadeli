import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  user$ = this._userService.user$;

  constructor() {
    this.createUrlEntryForm();
    this.user$.pipe(
      tap((user) => console.log(user)),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe();
  }

  copyToClipboard() {
    throw new Error('Method not implemented.');
  }

  createUrlEntryForm(): void {
    this.urlEntryFormGroup = this._fb.group({
      url: ['', { validators: [Validators.required, Validators.maxLength(TINY_URL_CONSTANT.URL_MAX_LENGTH), urlValidator] }],
      alias: ['', { validators: [Validators.maxLength(TINY_URL_CONSTANT.ALIAS_MAX_LENGTH)] }]
    });

    this.urlEntryFormGroup.valueChanges.pipe(
      debounceTime(TINY_URL_CONSTANT.DEBOUNCE_TIME),
      tap((value) => {
        console.log(value);
        this._tinyUrlService.tinyUrl = value.url;
      }),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe()
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  login() {
    this._userService.login({ userName: USER_CONSTANT.USER_NAME, email: '', password: '' });
  }

}
