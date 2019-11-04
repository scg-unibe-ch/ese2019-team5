import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPage} from './start/login/login.page';
import {StartPage} from './start/start.page';
import {SignupPage} from './start/signup/signup.page';
import {ConfirmationPage} from "./start/confirmation/confirmation.page";
import {UserprofilePage} from "./start/userprofile/userprofile.page";
import {UpdatePasswordPage} from "./start/login/update-password/update-password.page";
import {CreateServicePage} from "./start/userprofile/create-service/create-service.page";
import {ServicesPage} from './start/services/services.page';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'start'},
  { path: 'start', children: [
      {path: '', component: StartPage},
      {
        path: 'login', children: [
          {path: '', component: LoginPage},
          {path: 'resetPassword/:token', component: UpdatePasswordPage}]
      },
      {
        path: 'signup', children: [
          {path: '', component: SignupPage},
          {path: 'confirmation/:token', component: ConfirmationPage}]
      },
      {
        path: 'userprofile', children: [
          {path: '', component: UserprofilePage},
          {path: 'createService', component: CreateServicePage}]
      },
      {
        path: 'services', children: [
          {path: '', component: ServicesPage}]
      }]
  }
];


@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
