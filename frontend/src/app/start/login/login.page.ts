import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from "../../AuthService/auth.service";
import {Router} from "@angular/router";
import {first} from "rxjs/operators";

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
  returnUrl: string;
  error = '';

  mail: string;
  pw: string;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router) {}

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ngOnInit() {
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  // ToDo: Implement verification etc.
  logIn() {
    this.authService.login(this.mail, this.pw).pipe(first()).subscribe(
      data => {this.router.navigate([this.returnUrl]).then(r => {}); },
        error => { this.error = error; });
  }
}
