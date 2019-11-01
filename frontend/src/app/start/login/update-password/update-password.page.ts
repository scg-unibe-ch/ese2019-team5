import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-reset-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {
  url: string;
  token: string;

  setPassword: boolean;
  loading: boolean;

  password: string;
  confirmation: string;

  error: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.setPassword = false;
    this.loading = false;

    this.url = (this.activatedRoute.toString());
    this.token = this.url.substr(24, this.url.length - 54);
    console.log(this.token);
  }

  setNewPassword() {
    if (this.password == this.confirmation) {
      if (this.password.length >= 6) {
        this.loading = true;
        const password = this.password;
        this.httpClient.post('http://localhost:3000/login/forgotPassword/' + this.token, {password}).subscribe(
          () => {
            this.setPassword = true;
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.error = error.message;
          }
        )
      } else {
        this.error = 'Your password is too short';
      }

    } else {
      this.error = 'Confirmation must be equal to password';
    }
  }

}
