import {Component, ViewChild} from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {NavigationExtras, Router, RouterModule} from '@angular/router';
import {StartPage} from './start/start.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  private text = 'First Text'



  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  )
  {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  changeText() {
    this.text = 'New Text';
  }

  //TO-DO: Why can't I write the same method as on the website?
  //What about return?
  //goToLogIn() {
 //   this.router.navigate(['/login'], null).then(r => true);
 // }

}
