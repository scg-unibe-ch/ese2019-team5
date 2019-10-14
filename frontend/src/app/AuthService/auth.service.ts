import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../User class/user';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

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
    return this.httpClient.post<User>('http://localhost:3000/user', {email, password}).pipe(map(user => {
      // store jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  /**
   * Called by the logout button on any page
   * Deletes all stored authentication data from the local storage
   */
  logout() {
    // remove user from local storage to log out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
