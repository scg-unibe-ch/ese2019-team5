import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import {User} from '../User class/user';
import * as fs from 'fs';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
import { assert } from 'console';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  publicKey = fs.readFileSync('../backend/app/Server (GC)/public.key', 'utf8');
  private user: Observable<User>;

  constructor(private httpClient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Called by LoginPage
   * Sends a request to the backend
   * If the request was valid, it stores the JWT-Token and User details returned form backend in the client's local storage
   * Otherwise, an error occurs (handled by LoginPage)
   * @param email address entered in the login form
   * @param password entered in the login form
   */
  // TODO: url must match backend
  login(email: string, password: string) {
    // Set params for http request
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);

    this.user = this.httpClient.post<User>('http://localhost:3000/login', { params} );
    this.setSession(this.user);
    return this.user;
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
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
    this.currentUserSubject.next(null);
  }


  private setSession(authResult) {
    const verifyOptions = {
      issuer: 'Eventdoo',
      subject: 'email',
      expiresIn: '7d',
      algorithm: 'RS256'
    };

    if (jwt.verify(authResult.token, this.publicKey, verifyOptions)) {
      const expiresAt = moment().add(authResult.token.expiresIn, 'second');
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
      localStorage.setItem('id_token', authResult.token.id);
    }
  }

  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
