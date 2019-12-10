import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AlertController} from "@ionic/angular";
import {HashService} from '../../HashService/hash.service';


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

  readonly ROOT_URL = 'http://localhost:3000/signup';

  pw: string;
  loading: boolean;
  error: string;

  constructor(
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private http: HttpClient) {
  }


  /**
   * Collects and verifies all necessary information needed to create a user profile
   */
  signUpForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstname: ['', [Validators.required, Validators.pattern("[a-zA-ZäÄöÖüÜ,\\s]{2,}")]],
    lastname: ['', [Validators.required, Validators.pattern("[a-zA-ZäÄöÖüÜ,\\s]{2,}")]],
    street: ['', [Validators.required, Validators.pattern("[a-zA-ZäÄöÖüÜ,\\s]{2,}")]],
    housenumber: ['', [Validators.required, Validators.pattern("[0-9]*[a-zA-Z]?")]],
    zip: ['', [Validators.required, Validators.pattern("[0-9]{4}")]],
    city: ['', [Validators.required, Validators.pattern("[a-zA-ZäÄöÖüÜ,\\s]{2,}")]],
    password: [this.pw, [Validators.required, Validators.minLength(6)]],
    confirmation: ['', [Validators.required, Validators.pattern]],
    accept: ['false', Validators.requiredTrue]
  });


  ngOnInit() {
    this.loading = false;
    this.pw = '';
  }

  /**
   * Get-methods for signUpForm
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
  get accept() {
    return this.signUpForm.get('accept');
  }


  /**
   * Sends all data entered in the form to backend (if the input is valid {@link validateInput}).
   * Handles the response from backend.
   */
  saveUser() {
    this.loading = true;
    if (this.validateInput()) {
      console.log('Input valid');
      //prepare body for httpClient-post
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

      // post data to the httpClient
      console.log('Starting request');
      this.http.post(this.ROOT_URL,
        {firstname, lastname, email, pwhash, street, housenumber, zip, city, isVerified})
        .subscribe(
          (success) => {
            console.log('Successful');
            this.loading = false;
            this.presentSuccessAlert().then(r => {
            });
          },
          (error) => {
            this.loading = false;
            console.log('Bad email');
            this.error = 'There is already an account assigned to your email address. Please log in or chose another address.';
         console.log(error)
          });
    } else {
      console.log('Invalid input');
      this.loading = false;
      this.error = 'Some of your input is invalid. Please check again.'
    }
  }

  /**
   *  A success and failure alert for the ion controller for both responses from the backend
   */
  async presentSuccessAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Successful Registration',
      message: 'Registration successful. Please verify your email address.',
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

  /**
   * Called when the user tries to sign up.
   * Ensures all input is valid.
   */
  private validateInput() {
    return this.email.valid &&
      this.firstname.valid &&
      this.lastname.valid &&
      this.street.valid && this.housenumber.valid &&
      this.zip.valid && this.city.valid &&
      this.password.value == this.confirmation.value &&
      this.accept.valid;

  }

  redirectToStartPage() {
    document.location.href = 'http://localhost:4200/start/';
  }
}
