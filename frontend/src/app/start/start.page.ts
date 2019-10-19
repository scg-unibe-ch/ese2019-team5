import { Component, OnInit } from '@angular/core';
import {AuthService} from "../AuthService/auth.service";

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  isLoggedIn(){
    return this.authService.isLoggedIn()
  }

  constructor(private authService: AuthService) {

  }

  ngOnInit() {
  }

}
