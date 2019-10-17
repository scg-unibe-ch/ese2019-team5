import { Component, OnInit } from '@angular/core';
import {User} from '../../User class/user';
import {FormControl, FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

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
 * ToDo: get name and surname
 */
export class SignupPage implements OnInit {

  // Todo figure out where to send HTTP requests
  readonly ROOT_URL = 'http://localhost:3000';
  // const bcrypt = require('bcrypt');

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  pw: string;
  mail: string;
  firstname: string;
  lastname: string;

  user: User;

  signUpForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    fname: ['', [Validators.required]],
    lname: ['', [Validators.required]],
    // ToDo: What are safety requirements for passwords? Which characters are allowed?
    password: ['', [Validators.required, Validators.minLength(6)]],
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
  get fname() {
    return this.signUpForm.get('fname');
  }
  get lname() {
    return this.signUpForm.get('lname');
  }
  get confirmation() {
    return this.signUpForm.get('confirmation');
  }

  // ToDo: Implement initialization
  ngOnInit() {
  }

  // ToDo: Implement how data is sent to the database
  // ToDo: Hashing  password bcrypt
  /**
   * Creates a new User-object according to data entered in form
   * "Valid" is false as User must first be verified
   */
  saveUser() {
    const pwhash = this.pw; // bcrypt.hashSync(this.pw, 10);
    // this.user = new User(this.mail, hashedPw);
    const email =  this.mail;
    const name = this.firstname;
    const surname = this.lastname;
    const isVerified = false;
<<<<<<< Updated upstream
    this.http.post(this.ROOT_URL + '/user', {email, name, surname, pwhash, isVerified}) // Todo Change to signup
=======
    this.http.post(this.ROOT_URL + '/user', {email, name, surname, pwhash, isVerified})
>>>>>>> Stashed changes
      .subscribe();
  }
}
