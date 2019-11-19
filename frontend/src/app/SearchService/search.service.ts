import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EventService} from "../../../../backend/app/models/eventService.model";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor ( private http: HttpClient) { }

  getAllServices () {
    this.http.get<Array<EventService>>('http://localhost:3000/search')
      .subscribe(
        (data)=> {
          console.log(data);
          return data;
        }, (error) => {
          console.log(error);
          return '';
        });
  }
}
