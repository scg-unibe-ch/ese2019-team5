import { Component, OnInit } from '@angular/core';
import {EventService} from "../../../../../backend/app/models/eventService.model";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../AuthService/auth.service";


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  loading: boolean;
  services: EventService[];
  userId: string;


  constructor(private http: HttpClient, private authservice:AuthService,) {
  }

  ngOnInit() {
    this.userId = this.authservice.getUserId();
    this.loading = true;
    console.log(this.userId);
    this.http.get<Array<EventService>>('http://localhost:3000/profile/favourite/:' + this.userId)
      .subscribe(
        (data)=> {
          this.services = data;
          console.log(data);
        }, (error) => {
          console.log(error);
        });
    this.loading = false;

  }

  redirectStartPage() {
    document.location.href = 'http://localhost:4200/start/';
  }


}
