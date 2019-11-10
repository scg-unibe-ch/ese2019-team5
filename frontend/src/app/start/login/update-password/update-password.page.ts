import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {HashService} from "../../../HashService/hash.service";

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
    this.token = this.url.substr(24, this.url.length - 55);
    console.log(this.token);
  }

  setNewPassword() {
    if (this.password.length >= 6) {
      if (this.password.match(this.confirmation)) {
        this.loading = true;
        const password = HashService.hashPassword(this.password);
        this.httpClient.post('http://localhost:3000/login/resetPassword' + this.token, {password}).subscribe(
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
        this.error = 'Passwords must be equal.';
      }

    } else {
      this.error = 'Your password is too short (min. 6 characters).';
    }
  }

}
