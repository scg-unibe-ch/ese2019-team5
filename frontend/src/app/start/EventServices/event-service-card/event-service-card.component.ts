import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../../../../backend/app/models/eventService.model";
import {AuthService} from "../../../AuthService/auth.service";
import {AlertController, ToastController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";

/**
 * Used to Display EventServices on various pages.
 * Array of Events and a desired size of cards must be passed as an input
 * Contains also logic to
 */

@Component({
  selector: 'event-service-card',
  templateUrl: './event-service-card.component.html',
  styleUrls: ['./event-service-card.component.scss'],
})

export class EventServiceCardComponent implements OnInit {
  @Input() services: EventService[];
  @Input() width: any;

  constructor(
    private auth: AuthService,
    private alert: AlertController,
    private toast: ToastController,
    private http: HttpClient
  ) {
  }

  ngOnInit() {}

  /**
   * Returns an icon name according to the category of the event.
   * @param category
   */
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

  /**
   * Presents the user an alert to check if he really wants to delete his service. If so the event will be deleted.
   * @param eventId ID of event to be deleted
   */
  async deleteConfirmation(eventId: string) {
    const alert = await this.alert.create({
      header: 'Confirm Delete',
      message: 'Do you really want to delete your service? You cannot undo this action',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: ()=>{
            this.deleteEventService(eventId);
            this.toast.create({
              message: 'Service deleted successfully',
              duration: 3000,
              position: 'bottom'
            })
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Sends a delete http request to backend that will subsequently delete an eventservice from the database.
   * @param eventId ID of the event that will be deleted
   */
  async deleteEventService(eventId: string){
      await this.http.delete('http://localhost:3000/eventservice/'+eventId)
        .subscribe(
          (res)=> {console.log('delete success')},
          (error)=>{ console.log(error)}
        );
      location.reload();
  }

  /**
   * Called when a card is clicked
   * Redirects the user to the event's detail page
   * @param serviceId, the ID of the service to be redirected to
   */
  redirectToDetailPage(serviceId: string) {
    document.location.href = 'http://localhost:4200/start/services/'+serviceId;
  }
}
