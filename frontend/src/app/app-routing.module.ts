import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPage} from './start/login/login.page';
import {StartPage} from './start/start.page';
import {SignupPage} from './start/signup/signup.page';
import {ConfirmationPage} from "./start/confirmation/confirmation.page";
import {UserprofilePage} from "./start/userprofile/userprofile.page";



const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'start'},
  { path: 'start', children: [
      {path: '', component: StartPage},
      {path: 'login', component: LoginPage},
      {
        path: 'signup', children: [
          {path: '', component: SignupPage},
          {path: 'confirmation/:token', component: ConfirmationPage}
        ]
      },
      { path: 'userprofile', component: UserprofilePage }]
  }];


@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
