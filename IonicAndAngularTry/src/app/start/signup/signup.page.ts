import { Component, OnInit } from '@angular/core';
import {User} from "../../User class/user";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

/**
 * Page SignupPage
 * Asks the user for the minimal required information and "saves" it as a User-Object
 * Only when all information is available and valid, a User can sign up (send his data to the database)
 * Sends data to the Database (to be implemented)
 */
export class SignupPage implements OnInit {

  constructor() { }
  // A new User-object is instantiated when SignUp-Page is called
  user = new User('', '', '', false);

  // To-Do: Implement initialization
  ngOnInit() {
  }

  // To-Do: Implement how data is sent to the database
  saveUser() {}
}
