import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../../../../../../backend/app/models/eventService.model";

@Component({
  selector: 'app-event-service-detail',
  templateUrl: './event-service-detail.page.html',
  styleUrls: ['./event-service-detail.page.scss'],
})
export class EventServiceDetailPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
  ) { }

  private serviceId: string;
  private loadedEventService: EventService;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('serviceId')){
        //redirect
        return;
      }
      this.serviceId = paramMap.get('serviceId');
      console.log(this.serviceId);
    });
    const params = new HttpParams().set('serviceId', this.serviceId);
    this.http.get<EventService>('http://localhost:3000/search/'+this.serviceId).subscribe(
    (data)=>{
      this.loadedEventService = data;
    },
    (error)=>{
      console.log(error);
    }
    )
  }

}
