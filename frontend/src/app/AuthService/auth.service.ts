import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import {User} from '../User class/user';
import {Token} from '@angular/compiler';
import * as fs from 'fs';

import * as jwt from 'jsonwebtoken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  publicKey = fs.readFileSync('../backend/app/Server (GC)/public.key', 'utf8');
  private token: Observable<Token>;

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
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);

    this.token = this.httpClient.get<Token>('http://localhost:3000/login', { params} );
    this.setSession(this.token);
    return this.token;
  }

    /*pipe(map(user => {
      // store jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));*/

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

    if (jwt.verify(authResult, this.publicKey, verifyOptions)) {
      const decoded = jwt.decode(authResult);
      localStorage.setItem('id_token', authResult);
    }
  }


}
