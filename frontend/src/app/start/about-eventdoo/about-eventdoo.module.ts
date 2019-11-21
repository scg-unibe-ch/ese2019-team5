import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AboutEventdooPage } from './about-eventdoo.page';

const routes: Routes = [
  {
    path: '',
    component: AboutEventdooPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AboutEventdooPage]
})
export class AboutEventdooPageModule {}
