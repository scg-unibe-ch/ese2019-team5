import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../AuthService/auth.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {NgModel} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

/**
 * LoginPage
 * Asks an (existing) user for his authentication data (e-mail, password)
 * Does entire Authentication-stuff...
 * To be implemented
 */
export class LoginPage implements OnInit {

  authService: AuthService;
  returnUrl= '/start';
  error = '';

  email: string;
  password: string;

  constructor(
    private router: Router) {}

  ngOnInit() {
  }

  /**
   * Called when the user presses the login button.
   * Sends data entered in the form to the AuthService
   * Handles the "result":
   * If log in was successful, the user is sent to another url.
   * If an error occurs, the error message is displayed on the bottom of the page.
   */
  logIn() {
    this.authService.login(this.email, this.password).pipe(first()).subscribe(
      data => {this.router.navigate([this.returnUrl]).then(r => {}); },
        error => { this.error = error; });
  }
}
