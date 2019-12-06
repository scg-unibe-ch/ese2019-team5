import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../AuthService/auth.service';
import {Router} from '@angular/router';
import {User} from '../../../../../backend/app/models/user.model';
import {AlertController, ToastController} from "@ionic/angular";
import {Observable} from 'rxjs';
import {HashService} from "../../HashService/hash.service";
import {HttpClient} from "@angular/common/http";
import {Events} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

/**
 * LoginPage
 * Asks an (existing) user for his authentication data (e-mail, password)
 * Uses AuthService to verify data
 * Sends the User back to start page if log in was successful
 * Displays an error message if there was a mistake (invalid combination or User not verified)
 */
export class LoginPage implements OnInit {

  email: string;
  password: string;
  returnUrl = '/start';
  error = '';
  user: Observable<User>;
  loading: boolean;
  isVerified: boolean;
  isValidCombination: boolean;
  mailSent: boolean;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    public events: Events) {
  }

  ngOnInit() {
    this.loading = false;
    this.isVerified = true;
    this.isValidCombination = true;
    this.mailSent = false;
  }

  /**
   * Called when the user presses the login button.
   * Asserts that the user filled in the entire form {@link validateInput}
   * Sends data entered in the form to the AuthService.
   * Handles the result.
   */
  logIn() {
    this.error = '';
    this.isValidCombination = true;
    this.isVerified = true;
    this.loading = true;

    if (this.validateInput()) {

      this.authService.login(this.email, HashService.hashPassword(this.password)).subscribe(
        (success) => {
          this.loading = false;
          this.router.navigate([this.returnUrl]).then(r => {
            this.LogInPopUp().then(r => {
            });
          });
        },
        (error) => {
          this.loading = false;
          console.log("error: " + error.message);
          if (error.status == 406) {
            this.isVerified = false;
          }
          if (error.status == 404) {
            this.isValidCombination = false;
          }
        });
    } else {
      this.loading = false;
      this.error = 'Some of your input is invalid. Please check again.'
    }
  }

  /**
   * Called by the user by pushing the correspondent button
   * Opens a PopUp asking the User to enter his/her email address
   * Posts the email address to backend demanding it to send a new verification email to the user.
   */
  sendMailAgain() {
    let url = 'http://localhost:3000/signup/sendMailAgain';
    let header = 'Send verification mail again';
    this.emailPopUp(header, url).then(r => {
    });
  }

  /**
   * Called by the user by pushing the correspondent button
   * Opens a PopUp asking the User to enter his/her email address
   * Posts the email address to backend demanding it to send a mail with a link to a page
   * where he/she can change the password.
   */
  resetPassword() {
    let header = 'Reset password';
    let url = 'http://localhost:3000/login/forgotPassword';
    this.emailPopUp(header, url).then(r => {
    });
  }

  /**
   * Called by sendMailAgain() and resetPassword()
   * Demands the User to enter his/her email address
   * If the user confirms, data is posted to backend.
   * @param header, the title of the popup
   * @param url, the url where the data should be posted to in backend
   */
  async emailPopUp(header: string, url: string) {
    const alert = await this.alertController.create({
      header: header,
      message: 'Please enter your email address: ',
      inputs: [{
        name: 'mail',
        type: "email",
        placeholder: 'email address'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      },
        {
          text: 'Submit',
          handler: (alertData) => {
            const email = alertData.mail;
            console.log(email);
            this.httpClient.post(url, {email}).subscribe(
              () => {
                this.mailSent = true;
              },
              (error) => {
                this.error = error.message;
              });
          }
        }]
    });
    await alert.present();
  }


  /**
   * Shows a Pop-Up for a successful login
   */
  async LogInPopUp() {
    const toast = await this.toastController.create({
      message: 'You have successfully logged in!',
      duration: 3000,
    });
    await toast.present();
    this.events.publish('user:login');
  }

  /**
   * Called when the user tries to log in
   * Asserts email and password are not empty.
   */
  private validateInput(){
    return this.email && this.password;
  }


  redirectToStartPage() {
    document.location.href = 'http://localhost:4200/start/';
  }
}
