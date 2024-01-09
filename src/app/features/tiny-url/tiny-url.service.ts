import { Injectable, inject } from '@angular/core';
import { ODSState } from 'src/app/shared/ods-state';
import { ITinyUrlAllMappings, ITinyUrlMapping } from './tiny-url.interface';
import * as TINY_URL_CONSTANT from './tiny-url.constant';
import { generateRandomNumericString } from 'src/app/shared/utils/randomNumericString.function';
import { UserService } from 'src/app/user.service';
import { IUser } from 'src/app/user.interface';
import { convertToValidUrl } from 'src/app/shared/utils/convert-to-url.function';

const initialState: ITinyUrlAllMappings = {
  mappings: []
};

@Injectable()
export class TinyUrlService extends ODSState<ITinyUrlAllMappings>{

  private readonly _user$ = inject(UserService).user$;
  private _currentUser!: IUser

  readonly tinyUrlMapping$ = this.select(state => state.mappings);
  readonly currentTinyUrlMap$ = this.select(state => state.mappings[state.mappings.length - 1]);

  constructor() {
    super(initialState);
    this.subscribeToUser();
  }

  subscribeToUser(): void {
    this._user$.subscribe(user => {
      if (user) {
        this._currentUser = user;
      }
    });
  }

  createTinyUrl(userInput: ITinyUrlMapping): void {
    const { url, alias } = userInput;

    const existingMapping = this.state.mappings.find(
      m => m.url === url || (alias && m.alias === alias)
    );

    if (existingMapping) {
      throw new Error('URL or alias already exists.');
    }

    const newMapping: ITinyUrlMapping = {
      url,
      tinyUrl: 'http://tinyurl.com/' + (alias ? alias : generateRandomNumericString(TINY_URL_CONSTANT.ALIAS_MAX_LENGTH)),
      alias,
      userName: this._currentUser.userName,
      clickCount: 0
    };

    this.setState({
      ...this.state,
      mappings: [...this.state.mappings, newMapping]
    });
  }

  goToUrl(tinyUrl: string): void {
    const mappingIndex = this.state.mappings.findIndex(mapping => mapping.tinyUrl === tinyUrl);
    let longUrl: string;

    if (mappingIndex !== -1) {
      const updatedMappings = [...this.state.mappings];
      longUrl = updatedMappings[mappingIndex].url as string;
      updatedMappings[mappingIndex] = {
        ...updatedMappings[mappingIndex],
        clickCount: updatedMappings[mappingIndex].clickCount + 1
      };

      this.setState({
        ...this.state,
        mappings: updatedMappings
      });

      if (longUrl) {
        window.open(convertToValidUrl(longUrl) as string, '_blank');
      }
    }

  }

  deleteTinyUrl(tinyUrl: string): void {
    if (!this._currentUser) {
      throw new Error('User not logged in.');
    }

    const mapping = this.state.mappings.find(mapping => mapping.tinyUrl === tinyUrl);

    if (!mapping || mapping.userName !== this._currentUser.userName) {
      throw new Error('Unauthorized or non-existent tiny URL.');
    }

    this.setState({
      ...this.state,
      mappings: this.state.mappings.filter(m => m !== mapping)
    });
  }

  statsTinyUrl(tinyUrl: string): void {
    throw new Error('Method not implemented.');
  }

  existsTinyUrl(tinyUrl: string): void {
    throw new Error('Method not implemented.');
  }
}

