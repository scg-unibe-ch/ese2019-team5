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
   * @param mail address entered in the login form
   * @param password entered in the login form
   */
  login(mail: string, password: number) {
    // Set params for http request
    /*let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);*/
    const email = mail;
    const pwhash = password;

      // Post http request
    console.log('Try to log in');
    this.user = this.httpClient.post<User>('http://localhost:3000/login', {email, pwhash});
    this.user.subscribe(
      (data) => {
        this.setSession(data)
      }
      /*(error) => {this.handleError(error)}*/);
    console.log("return user: " + this.user);
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
      console.log(authResult.user);
      const expiresAt = moment().add(authResult.expiresIn, 'second');
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
      localStorage.setItem('id_token', authResult.user.id);
      console.log('Setting session successful');

       } catch (e) {
      console.log(e);
      }
   // }
  }

  // Not used but might be used later?
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
