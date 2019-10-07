import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {log} from "util";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
/**
 * LoginPage
 * Asks an (existing) user for his authentification data (e-mail, password)
 * Does entire Authentification-stuff...
 * To be implemented
 */
export class LoginPage implements OnInit {



  constructor(private formBuilder: FormBuilder) { }

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

  // To-Do: Implement verification etc.
  logIn() {

  }
}
