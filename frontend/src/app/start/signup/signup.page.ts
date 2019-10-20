import { Component, OnInit } from '@angular/core';
import {User} from '../../User class/user';
import {FormControl, FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AlertController} from "@ionic/angular";

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

  // Todo figure out where to send HTTP requests
  readonly ROOT_URL = 'http://localhost:3000';
  // const bcrypt = require('bcrypt');

  constructor(private alertCtrl: AlertController, private formBuilder: FormBuilder, private http: HttpClient) { }

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
    const firstname = this.firstname;
    const lastname = this.lastname;
    const isVerified = false;

  //  this.http.post(this.ROOT_URL + '/signup', { name, surname, email, pwhash, isVerified});

    this.http.post(this.ROOT_URL + '/signup', { firstname, lastname, email, pwhash, isVerified}) // TODO auswählen welche Variante
      .subscribe(
        (completed) => this.presentSuccessAlert(),
        (error) => this.presentFailureAlert(error.message))
  }



  /**
   *  A success and Failure alert for the ion controller for both responses from the backend
   */
  async presentSuccessAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Successful Registration',
      message: 'You have registered successfully. We have sent you an email to verify your account. Please confirm your email to gain access to all features',
      buttons: [{
        text: 'Got it',
        handler: () => {
          document.location.href = 'http://localhost:4200/start';
        }
      }]
    });
    await alert.present();
  }

  async presentFailureAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Failed to register',
      message: message,
      buttons: [{
        text: 'Got it'
      }]
    });
    await alert.present();
  }
}
