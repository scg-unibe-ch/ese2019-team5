import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../AuthService/auth.service";
import {HttpClient} from "@angular/common/http";
import {ServiceRequest} from "../../../../../../backend/app/models/serviceRequest.model";

@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.page.html',
  styleUrls: ['./request-history.page.scss'],
})
export class RequestHistoryPage implements OnInit {
  userId: string;
  requests: ServiceRequest[];
  empty: boolean;

  constructor(private authService: AuthService,
              private http: HttpClient) {}

  ngOnInit() {
    this.empty = false;
    this.userId = this.authService.getUserId();
    this.http.get('http://localhost:3000/profile/requestedServices/' + this.userId).subscribe(
      (data) => { this.requests = <ServiceRequest[]>data;
      if (this.requests.length == 0)
        this.empty = true;},
    (error) => {console.log(error)}
    );
  }

  getIcon(category: string) {
    switch (category) {
      case 'Music': {
        return 'musical-notes';
      }
      case 'Location': {
        return 'compass';
      }
      case 'Gastronomy': {
        return 'pizza';
      }
      case 'Entertainment': {
        return 'film';
      }
      case 'Photography': {
        return 'camera';
      }
      default: {
        return 'infinite';
      }
    }
  }
  navigateToDetailPage(serviceId: string) {
    document.location.href = 'http://localhost:4200/start/services/'+serviceId;
  }
}
