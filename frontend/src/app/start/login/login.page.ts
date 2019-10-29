import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../AuthService/auth.service';
import {Router} from '@angular/router';
import {User} from '../../../../../backend/app/models/user.model';
import {AlertController} from "@ionic/angular";
import {Observable} from 'rxjs';
import {HashService} from "../../HashService/hash.service";
import {HttpClient} from "@angular/common/http";

// (Sophie)
// ToDo: Passwort vergessen => '/login/forgotPassword'
// Sendet Anfrage an Backend (post mail), wenn Email gut, mail an kunde --> Link auf Seite, wo Passwort geändert werden kann
// ToDo: SendMail again => 'localhost3000/signUp' (post email-addresse)

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
    private alertController: AlertController) {
  }

  ngOnInit() {
    this.loading = false;
    this.isVerified = true;
    this.isValidCombination = true;
    this.mailSent = false;
  }

  /**
   * Called when the user presses the login button.
   * Sends data entered in the form to the AuthService
   * Handles the "result":
   * If log in was successful, the user is sent to another url.
   * If an error occurs, the error message is displayed on the bottom of the page.
   */
  logIn() {
    this.loading = true;
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

  }

  //ToDo: Does not work yet
  sendMailAgain() {
    console.log('send mail again');
    const emailAddress = this.emailAddressPopUp('Send verification-email again').then(r => {
      console.log(emailAddress)
    });
    if (emailAddress != null) {
      this.httpClient.post('http://localhost3000/signup/sendMailAgain', emailAddress).subscribe(
        () => {
          this.mailSent = true
        },
        (error) => {
          this.error = error.message
        });
    }
  }

  //ToDo: Does not work yet
  resetPassword() {
    console.log('Reset Password');
    const emailAddress = this.emailAddressPopUp('Reset password').then(r => {
    });
    if (emailAddress != null) {
      this.httpClient.post('http:/localhost3000/login/forgotPassword', emailAddress).subscribe(
        () => {
          this.mailSent = true
        },
        (error) => {
          this.error = error.message
        });
    }
  }

  async emailAddressPopUp(header: string) {
    let result = '';
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
            result = alertData.mail;
          }
        }]
    });

    await alert.present();
    return result;

  }


  /**
   * Shows a Pop-Up for a successful login
   */
  async LogInPopUp() {
    const alert = await this.alertController.create({
      header: 'Congratulations',
      message: 'You have successfully logged in!',
      buttons: ['Okay']
    });

    await alert.present();
  }
}
