import { Component, OnInit } from '@angular/core';
import { EventService} from "../../../../../backend/app/models/eventService.model";
import {EventServiceContainer} from "../../../../../backend/app/models/eventServiceContainer.model";
import {userJson} from "../userprofile/userJson";
import {HttpClient} from "@angular/common/http";
import {forEach} from "@angular-devkit/schematics";
import {map, tap} from "rxjs/operators";
//import {eventJson} from "./eventJson";

@Component({
  selector: 'app-services',
  templateUrl: './event-services.page.html',
  styleUrls: ['./event-services.page.scss'],
})
export class EventServicesPage implements OnInit {
  eventList: EventService[] = [];


  constructor(
    private http: HttpClient,
    ) { }

  getServicesFromBackend(){
  this.http.get<Array<EventService>>('http://localhost:3000/search')
    .subscribe(
      (data)=> {
        this.eventList = data;
      }, (error) => {
        console.log(error);
      });
  }

  private update(){
    this.getServicesFromBackend()
  }


  doRefresh(event) {
    console.log('Begin async operation');
    this.update();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1200);
  }

  getIconName(category:string){
    switch (category){
      case 'Music': {
        return 'musical-notes';
      }
      case 'Location': {
        return 'compass';
      }
      case 'Food': {
        return 'pizza';
      }
      case 'Gastronomy': {
        return 'pizza';
      }
      case 'Entertainment': {
        return 'game-controller-b';
      }
      case 'Photography': {
        return 'camera';
      }
      default: {
        return 'infinite';
      }
    }
  }



  ngOnInit() {
    this.getServicesFromBackend();
  }
}
