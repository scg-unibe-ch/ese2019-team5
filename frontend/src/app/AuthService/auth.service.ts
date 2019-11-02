import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
import {User} from '../../../../backend/app/models/user.model';

var jwtDecode = require('jwt-decode');

@Injectable({ providedIn: 'root' })
export class AuthService {
  //publicKey = fs.readFileSync('../backend/app/services/public.key', 'utf8');
  private user: Observable<User>;

  constructor(private httpClient: HttpClient) {}

  /**
   * Called by {@link LoginPage}
   * Sends a request to the backend
   * If the request was valid, a User object with a JWT-Session-Token is returned and is handled in setSession.
   * Otherwise, an error occurs (handled by LoginPage)
   * @param mail address entered in the login form
   * @param password entered in the login form
   */
  login(mail: string, password: number) {
    // Set params for http request
    const email = mail;
    const pwhash = password;

    console.log(email + ' | ' + pwhash);

      // Post http request
    console.log('Try to log in');
    this.user = this.httpClient.post<User>('http://localhost:3000/login', {email, pwhash});
    this.user.subscribe(
      (data) => {
        this.setSession(data)
      }
      /*(error) => {this.handleError(error)}*/
    );
    return this.user;
    }

  /**
   * Called by the logout button on any page
   * Deletes all stored authentication data from the local storage
   */
  logout() {
    // remove user from local storage to log out
    localStorage.removeItem('ed_token');
  }



  /**
   * Returns whether a user is already logged in by
   * checking whether there is a session token and whether it can be decoded.
   */
  public isLoggedIn() {
    try {
      const token = localStorage.getItem('ed_token');
      const decoded = jwtDecode(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }


  public getUserId() {
    const token = localStorage.getItem('ed_token');
    const decoded = jwtDecode(token);
    return decoded.data1;
  }


  /**
   * Called by method login()
   * Decodes the session token returned by backend
   * Stores the user's ID Token and it's expiration stamp in the user's local storage
   * @param authResult
   */
  private setSession(authResult) {
    console.log('Setting session');

    try {
      console.log(authResult.token);
      localStorage.setItem('ed_token', authResult.token);
      console.log('Setting session successful');
    } catch (e) {
      console.log(e);
      }
  }

  // Not used yet but might be used later
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent){
      errorMessage = 'Error: $[error.error.message]';
    } else {
      errorMessage = 'Error Code: $[error.status] \n' +
        'Message: $[error.message]';
    }
    return throwError(errorMessage);
  }

  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
