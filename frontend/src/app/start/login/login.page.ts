import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../AuthService/auth.service';
import {Router} from '@angular/router';
import {User} from '../../../../../backend/app/models/user.model';
import {AlertController} from "@ionic/angular";
import {Observable} from 'rxjs';
import {HashService} from "../../HashService/hash.service";

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController) {}

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
    this.authService.login(this.email, HashService.hashPassword(this.password)).subscribe(
      success => {
        this.router.navigate([this.returnUrl]).then(r => {
          this.LogInPopUp().then(r => {
          });
        });
      },
      error => {
        console.log("error appeard" + error.message);
        this.error = 'Invalid email or password. \n If you have not verified your email address yet, please check your mails';
      });
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
