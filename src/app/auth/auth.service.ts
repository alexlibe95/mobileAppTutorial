import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userIsAuthenticated = true;
  private userId = 'abc';

  get UserIsAuthenticated() {
    return this.userIsAuthenticated;
  }

  constructor() { }

  get UserId() {
    return this.userId;
  }

  login() {
    this.userIsAuthenticated = true;
  }

  logout() {
    this.userIsAuthenticated = false;
  }
}
