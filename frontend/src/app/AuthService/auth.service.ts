import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription, throwError} from 'rxjs';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
import {User} from '../../../../backend/app/models/user.model';
import {catchError} from 'rxjs/operators';
import {error} from 'util';
//import * as fs from 'fs';
//var fs =require(fs);



@Injectable({ providedIn: 'root' })
export class AuthService {
  //publicKey = fs.readFileSync('../backend/app/services/public.key', 'utf8');
  private user: Observable<User>;

  constructor(private httpClient: HttpClient) {}

  /**
   * Called by LoginPage
   * Sends a request to the backend
   * If the request was valid, a User object with a JWT-Session-Token is returned and is handled in setSession.
   * Otherwise, an error occurs (handled by LoginPage)
   * @param email address entered in the login form
   * @param password entered in the login form
   */
  login(email: string, password: string) {
    // Set params for http request
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);

      // Post http request
    try {
    console.log('Try to log in');
    this.user = this.httpClient.post<User>('http://localhost:3000/login', { params} );
    } catch (HttpErrorResponse) {
    console.log('Login failed in backend');
    return Observable.throw(new Error('Invalid email address or password'));
    }

    // Set session
    console.log('Trying to set session');
    this.setSession(this.user);
    return this.user;
  }


  /**
   * Returns whether a user is already logged in by
   * checking whether there is a session token and whether it is expired.
   */
  public isLoggedIn() {
    try {
      return moment().isBefore(this.getExpiration());
    } catch (e) {
      return false;
    }
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }


  /**
   * Called by the logout button on any page
   * Deletes all stored authentication data from the local storage
   */
  logout() {
    // remove user from local storage to log out
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }


  /**
   * Verifies the token of the returned User object
   * Stores the user's ID Token and it's expiration stamp in the user's local storage
   * @param authResult
   */
  private setSession(authResult) {
    /*const verifyOptions = {
      issuer: 'Eventdoo',
      subject: 'email',
      expiresIn: '7d',
      algorithm: 'RS256'
    };*/

    console.log('Setting session');

    // if (jwt.verify(authResult.token, this.publicKey, verifyOptions)) {
    try {
      const expiresAt = moment().add(authResult.token.expiresIn, 'second');
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
      localStorage.setItem('id_token', authResult.token.id);
      console.log('Setting session successful');
       } catch (e) {
      console.log(e);
      }
   // }
  }

  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
