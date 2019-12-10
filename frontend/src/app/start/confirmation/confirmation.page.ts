import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../AuthService/auth.service";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

/**
 * Page the user is sent to to verify his email address
 *
 */

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {

  // Variables to get the token
  url: string;
  token: string;

  // Variables for user feedback
  loading: boolean;
  verified: boolean;
  error: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient) {
  }

  /**
   * Gets the Token from the activated route URL
   * Sends it to backend to verify the user's email address.
   * Handles response
   */
  ngOnInit() {
    this.verified = false;
    this.loading = true;
    this.url = (this.activatedRoute.toString());
    this.token = this.url.substr(24, this.url.length - 54);
    console.log(this.token);
    this.httpClient.head('http://localhost:3000/signup/confirmation/' + this.token).subscribe(
      () => {
        this.loading = false;
        this.verified = true;
      },
      (error) => {
        this.loading = false;
        this.error = error.message
      });
  }

}
