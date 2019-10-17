import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPage} from './start/login/login.page';
import {StartPage} from './start/start.page';
import {SignupPage} from './start/signup/signup.page';



const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', children: [
      {path: '', component: StartPage},
      {path: 'login', component: LoginPage},
      {path: 'signup', component: SignupPage},
    ]},
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
