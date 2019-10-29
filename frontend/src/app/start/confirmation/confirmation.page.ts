import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../AuthService/auth.service";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

//ToDo: Handle expired tokens etc.

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
  url: string;
  token: string;

  loading: boolean;
  verified: boolean;
  error: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient) {
  }

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
