import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refteshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userIsAuthenticated = false;
  private userId = null;

  get UserIsAuthenticated() {
    return this.userIsAuthenticated;
  }

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=
      ${environment.firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );
  }

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
