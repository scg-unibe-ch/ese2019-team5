import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {HashService} from "../../../HashService/hash.service";

/**
 * Users are sent to this page when resetting their password
 * Link is generated in backend
 * Gets new password from user input and sends it to backend to update it
 */

@Component({
  selector: 'app-reset-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

  // Variables for authentication
  url: string;
  token: string;

  // Variables for user feedback
  setPassword: boolean;
  loading: boolean;
  error: string;

  // Variables for data binding from form
  password: string;
  confirmation: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient) {
  }

  /**
   * Gets authentication token from the URL the user was sent to
   */
  ngOnInit() {
    this.setPassword = false;
    this.loading = false;

    this.url = (this.activatedRoute.toString());
    this.token = this.url.substr(25, this.url.length - 56);
  }

  /**
   * Called by the user when pushing the button
   * Validates the input before sending it to backend
   * Handles the response from backend
   * Generates user feedback
   */
  setNewPassword() {
    if (this.password.length >= 6) {
      if (this.password == this.confirmation) {
        this.loading = true;
        const password = HashService.hashPassword(this.password);
        const token = this.token;
        this.httpClient.post('http://localhost:3000/login/resetPassword', {password, token}).subscribe(
          () => {
            this.setPassword = true;
            this.error = '';
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.error = error.message;
          }
        )
      } else {
        this.error = 'Passwords must be equal.';
      }

    } else {
      this.error = 'Your password is too short (min. 6 characters).';
    }
  }

}
