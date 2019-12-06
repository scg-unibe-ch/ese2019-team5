import {Component} from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from "./AuthService/auth.service";
import {Events} from "@ionic/angular";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  navigate : any;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public events: Events,
  ) {
    events.subscribe('user:login', () => {
      this.sideMenu();
    });
    this.sideMenu();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /**
   * function used to setup the side-Menu on mobile devices
   */
  sideMenu()
  {
    if(this.authService.isLoggedIn()) {
      this.navigate =
        [
          {
            title : "My Profile",
            url   : "/start/userprofile",
            icon  : "body"
          },
          {
            title: "Favorites",
            url: "/start/favorites",
            icon: "star"
          },
          {
            title: "Order History",
            url: "/start/userprofile/requested-services",
            icon: "repeat"
          }
        ]
    } else {
      this.navigate =
        [
          {
            title : "Login",
            url   : "/start/login",
            icon  : "ios-log-in"
          },
          {
            title : "Sign Up",
            url   : "/start/signup",
            icon  : "add"
          },
        ]
    }


  }
}
