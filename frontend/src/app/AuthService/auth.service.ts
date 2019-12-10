import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../../../backend/app/models/user.model';
import {ToastController} from "@ionic/angular";

/* For comments */
import {LoginPage} from "../start/login/login.page";

// @ts-ignore
var jwtDecode = require('jwt-decode');

/**
 * Provides all kind of authentication functions to almost all components
 * Especially used by {@link LoginPage}
 */

@Injectable({ providedIn: 'root' })
export class AuthService {

  private user: Observable<User>;

  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController
  ) {}

  /**
   * Called by {@link LoginPage}
   * Sends a request to backend which validates the email address and the password entered by the user.
   * If the request was valid, a User object with a JWT-Session-Token is returned and is handled in setSession.
   * Otherwise, an error occurs (handled by LoginPage)
   * @param mail address entered in the login form
   * @param password entered in the login form
   */
  login(mail: string, password: number) {
    // Set params for http request
    const email = mail;
    const pwhash = password;

    // Post http request
    this.user = this.httpClient.post<User>('http://localhost:3000/login', {email, pwhash});
    this.user.subscribe(
      (data) => {
        this.setSession(data)
      });
    // return result
    return this.user;
    }

  /**
   * Called by the logout button in the header
   * Deletes all stored authentication data from the local storage
   */
  logout() {
    // remove user from local storage to log out
    localStorage.removeItem('ed_token');
    document.location.href = 'http://localhost:4200/start/';
    this.showLogoutToast();
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


  /**
   * Returns the ID of the user who's currently logged in.
   */
  public getUserId() {
    const token = localStorage.getItem('ed_token');
    const decoded = jwtDecode(token);
    return decoded.data1;
  }


  /**
   * Called by method {@link login}
   * Decodes the session token returned by backend
   * Stores the user's ID Token and in the user's local storage
   * @param authResult, the result returned by backend when trying to log in
   */
  private setSession(authResult) {
    try {
      localStorage.setItem('ed_token', authResult.token);
    } catch (e) {
      console.log(e);
      }
  }

  /**
   * Presents the user a message that confirms him logging out.
   */
  private async showLogoutToast() {
    let toast = await this.toastController.create({
      message: 'Successfully logged out',
      duration: 3000
    });
    await toast.present();
  }
}
