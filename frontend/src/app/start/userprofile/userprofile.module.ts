import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserprofilePage } from './userprofile.page';
import {AppModule} from "../../app.module";

const routes: Routes = [
  {
    path: '',
    component: UserprofilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AppModule
  ],
  declarations: [UserprofilePage]
})
export class UserprofilePageModule {}
