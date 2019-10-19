import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../AuthService/auth.service';
import {Router} from '@angular/router';
import {Observable} from "rxjs";
import {User} from '../../../../../backend/app/models/user.model';
import {AlertController} from "@ionic/angular";

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
  // ToDo: Why can't this.authService.login(...) be read?
  logIn() {
    try {
       this.authService.login(this.email, this.password).subscribe(
        () => {
          console.log('logged in?' + this.authService.isLoggedIn());
          this.router.navigate([this.returnUrl]).then(r => {
            this.LogInPopUp();
          }); });
    } catch (error) {
      this.error = error.msg;
    }
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
