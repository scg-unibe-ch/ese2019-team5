import { Component, OnInit } from '@angular/core';
import { EventService} from "../../../../../backend/app/models/eventService.model";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../AuthService/auth.service";

@Component({
  selector: 'app-services',
  templateUrl: './event-services.page.html',
  styleUrls: ['./event-services.page.scss'],
})
export class EventServicesPage implements OnInit {
  eventList: EventService[] = [];


  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) { }

  /**
   * Gets all services stored in the DB
   * Will maybe be moved to some kind of "SearchService"
   */
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


  ngOnInit() {
    this.getServicesFromBackend();
  }
}
