import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventServicesPage } from './event-services.page';
import {AppModule} from "../../app.module";

const routes: Routes = [
  {
    path: '',
    component: EventServicesPage
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
  declarations: [EventServicesPage]
})
export class EventServicesPageModule {}
