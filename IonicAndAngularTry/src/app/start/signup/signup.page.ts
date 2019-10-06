import { Component, OnInit } from '@angular/core';
import {User} from "../../User class/user";
import {PatternValidator} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor() { }
  user = new User('', '', '');

  ngOnInit() {
  }

  saveUser() {
    if (this.user.isValid()) {

    } else {

    }

  }
}
