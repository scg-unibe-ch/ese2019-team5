import { Component, OnInit } from '@angular/core';
import {User} from '../../User class/user';
import {FormControl, FormBuilder, Validators} from '@angular/forms';

// @ts-ignore
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

/**
 * Page SignupPage
 * Asks the user for the minimal required information and "saves" it as a User-Object
 * Only when all information is available and valid, a User can sign up (send his data to the database)
 * Sends data to the Database (to be implemented)
 */
export class SignupPage implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

  pw: string;
  user: User;

  signUpForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    // ToDo: What are safety requirements for passwords? --> State more conditions
    password: ['', [Validators.required]],
    confirmation: ['', [Validators.required, Validators.pattern]]
  });

  /**
   * Get-methods
   * Used in html-file for displaying error-messages
   */
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get confirmation() {
    return this.signUpForm.get('confirmation');
  }

  // ToDo: Implement initialization
  ngOnInit() {
  }

  // ToDo: Implement how data is sent to the database
  /**
   * Creates a new User-object according to data entered in form
   * "Valid" is false as User must first be verified
   */
  saveUser() {
    this.user = new User(this.email(), this.password(), false);
  }
}
