import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../AuthService/auth.service";
import {HttpClient} from "@angular/common/http";
import {ServiceRequest} from "../../../../../../backend/app/models/serviceRequest.model";
import {error} from "util";

/**
 * Displays all services a user has requested so far
 * (Available only for authenticated users)
 */

@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.page.html',
  styleUrls: ['./request-history.page.scss'],
})
export class RequestHistoryPage implements OnInit {
  userId: string;
  requests: ServiceRequest[];
  empty: boolean;
  error: string;

  constructor(private authService: AuthService,
              private http: HttpClient) {
  }

  /**
   * Gets all services the user has requested so far from backend
   */
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.empty = false;
      this.userId = this.authService.getUserId();
      this.http.get('http://localhost:3000/profile/requestedServices/' + this.userId).subscribe(
        (data) => {
          this.requests = <ServiceRequest[]>data;
          if (this.requests.length == 0)
            this.empty = true;
        },
        (error) => {
          console.log(error)
        }
      );
    } else
      this.error = 'You are not authenticated. Please log in or sign up.'
  }

  /**
   * Returns the icon's name according to a service's category
   * @param category
   */
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
