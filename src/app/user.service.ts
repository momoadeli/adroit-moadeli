import { Injectable } from '@angular/core';
import { ODSState } from './shared/ods-state';
import { IUser } from './user.interface';

const initialState: IUser = {
  userName: null,
  email: '',
  password: ''
};

@Injectable({
  providedIn: 'root'
})
export class UserService extends ODSState<IUser> {

  user$ = this.select(state => state);

  constructor() {
    super(initialState)
  }

  set user(user: IUser) {
    this.setState({ ...this.state, ...user });
  }

  login(user: IUser) {
    this.user = user;
  }
}
