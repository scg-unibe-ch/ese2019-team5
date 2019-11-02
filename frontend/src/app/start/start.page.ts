import { Component, OnInit } from '@angular/core';
import {AuthService} from "../AuthService/auth.service";

//ToDo: Profil-Seite (Lars) mit Link zu Service erstellen

//ToDo Visu: div. AngebotPage
// Zeigt alle in der DB gespeicherten Angebote an

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
