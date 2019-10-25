import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../AuthService/auth.service";


//ToDo: Empfangsseite (aus Backend) für Email Verification ('/signup/confirmation/token')
// (Sophie)

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

}
