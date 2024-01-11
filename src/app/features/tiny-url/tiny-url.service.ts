import { Injectable, inject } from '@angular/core';
import { ODSState } from 'src/app/shared/ods-state';
import { ITinyUrlAllMappings, ITinyUrlMapping } from './tiny-url.interface';
import * as TINY_URL_CONSTANT from './tiny-url.constant';
import { generateRandomNumericString } from 'src/app/shared/utils/randomNumericString.function';
import { UserService } from 'src/app/user.service';
import { IUser } from 'src/app/user.interface';
import { convertToValidUrl } from 'src/app/shared/utils/convert-to-url.function';

const initialState: ITinyUrlAllMappings = {
  mappings: [],
  aliasToTinyUrlMap: new Map(),
  tinyUrlToAliasMap: new Map()
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
    let newAlias = alias;

    if (newAlias && this.state.aliasToTinyUrlMap.has(newAlias)) {
      throw new Error('Alias already exists.');
    }

    if (!newAlias) {
      newAlias = generateRandomNumericString(TINY_URL_CONSTANT.ALIAS_MAX_LENGTH);
    }

    const newMapping: ITinyUrlMapping = {
      url,
      tinyUrl: 'http://tinyurl.com/' + newAlias,
      alias: newAlias,
      userName: this._currentUser.userName,
      clickCount: 0
    };

    this.state.mappings.push(newMapping);

    if (newMapping.tinyUrl) {
      this.state.aliasToTinyUrlMap.set(newMapping.alias as string, newMapping);
      this.state.tinyUrlToAliasMap.set(newMapping.tinyUrl, newMapping);
  
    }

    this.setState({
      ...this.state
    });
  }

  deleteTinyUrl(tinyUrl: string): void {
    if (!this._currentUser) {
        throw new Error('User not logged in.');
    }

    const mapping = this.state.tinyUrlToAliasMap.get(tinyUrl);
    if (!mapping) {
        throw new Error('Tiny URL does not exist.');
    }

    if (mapping.userName !== this._currentUser.userName) {
        throw new Error('Unauthorized to delete this tiny URL.');
    }

    // Delete the mapping from both maps
    this.state.aliasToTinyUrlMap.delete(mapping.alias as string);
    this.state.tinyUrlToAliasMap.delete(tinyUrl);

    // Remove the mapping from the array
    const updatedMappings = this.state.mappings.filter(m => m.tinyUrl !== tinyUrl);

    // Update the state with the new mappings
    this.setState({
        ...this.state,
        mappings: updatedMappings
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
}

