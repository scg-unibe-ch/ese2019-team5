import { Component, OnInit } from '@angular/core';
import {Platform} from "@ionic/angular";
import {AuthService} from "../AuthService/auth.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public devWidth = this.platform.width();
  constructor(
    private platform: Platform,
    private authService: AuthService,
    ) {}

  ngOnInit() {}

  refreshPage() {
    location.reload();
  }

  goHome() {
    location.replace("/start");
  }

}
