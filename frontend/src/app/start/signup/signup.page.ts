import { Component, OnInit } from '@angular/core';
import {User} from '../../User class/user';
import {FormControl, FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AlertController} from "@ionic/angular";
import {HashService} from '../../HashService/hash.service';


//ToDo: Empfangsseite (aus Backend) für Email Verification ('/signup/confirmation/token')
// (Sophie)

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

  readonly ROOT_URL = 'http://localhost:3000';
  // const bcrypt = require('bcrypt');

  constructor(private alertCtrl: AlertController, private formBuilder: FormBuilder, private http: HttpClient) { }

  pw: string;


  user: User;

  signUpForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    street: ['', Validators.required],
    housenumber: ['', Validators.required],
    zip: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    city: ['', Validators.required],
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

  get firstname() {
    return this.signUpForm.get('firstname');
  }

  get lastname() {
    return this.signUpForm.get('lastname');
  }

  get street() {
    return this.signUpForm.get('street');
  }

  get housenumber() {
    return this.signUpForm.get('housenumber');
  }

  get zip() {
    return this.signUpForm.get('zip');
  }

  get city() {
    return this.signUpForm.get('city');
  }

  get confirmation() {
    return this.signUpForm.get('confirmation');
  }

  // ToDo: Implement initialization
  ngOnInit() {
  }

  /**
   * Creates a new User-object according to data entered in form
   * "Valid" is false as User must first be verified
   */
  saveUser() {
    const pwhash = HashService.hashPassword(this.password.value);
    console.log(pwhash);
    const email = this.email.value;
    const firstname = this.firstname.value;
    const lastname = this.lastname.value;
    const street = this.street.value;
    const housenumber = this.housenumber.value;
    const zip = this.zip.value;
    const city = this.city.value;

    const isVerified = false;

  //  this.http.post(this.ROOT_URL + '/signup', { name, surname, email, pwhash, isVerified});

    //ToDo: Include address data in post-request -> reihenfole?
    this.http.post(this.ROOT_URL + '/signup', { firstname, lastname, email, pwhash, isVerified})
      .subscribe(

        (success) => this.presentSuccessAlert(),
        (error) => this.presentFailureAlert(error.message))
    console.log(city, zip, housenumber, street);
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
      message: 'This email is already signed up, please log in or use a different email address',
      buttons: [{
        text: 'Got it'
      }]
    });
    await alert.present();
  }
}
