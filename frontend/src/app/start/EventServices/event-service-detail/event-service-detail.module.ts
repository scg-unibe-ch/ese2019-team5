import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventServiceDetailPage } from './event-service-detail.page';
import {AppModule} from "../../../app.module";

const routes: Routes = [
  {
    path: '',
    component: EventServiceDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
  declarations: [EventServiceDetailPage]
})
export class EventServiceDetailPageModule {}
