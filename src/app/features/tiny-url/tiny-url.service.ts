import { Injectable } from '@angular/core';
import { ODSState } from 'src/app/shared/ods-state';
import { ITinyUrl } from './tiiny-url.interface';

const initialState: ITinyUrl = {
  url: '',
  tinyUrl: ''
};

@Injectable({
  providedIn: 'root'
})
export class TinyUrlService extends ODSState<ITinyUrl>{

  set tinyUrl(tinyUrl: string) {
    this.setState({ ...this.state, tinyUrl });
  }

  constructor() { 
    super(initialState);
  }
}
