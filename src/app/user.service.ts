import { Injectable } from '@angular/core';
import { ODSState } from './shared/ods-state';
import { IUser } from './user.interface';

const initialState: IUser = {
  userName: null,
  email: null,
  password: null
};

@Injectable({
  providedIn: 'root'
})
export class UserService extends ODSState<IUser> {

  readonly user$ = this.select(state => state);

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
