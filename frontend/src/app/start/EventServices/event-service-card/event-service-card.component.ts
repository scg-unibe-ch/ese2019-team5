import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../../../../backend/app/models/eventService.model";
import {Address} from "../../../../../../backend/app/models/address.model";
import {AuthService} from "../../../AuthService/auth.service";
import {AlertController, ToastController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'event-service-card',
  templateUrl: './event-service-card.component.html',
  styleUrls: ['./event-service-card.component.scss'],
})

export class EventServiceCardComponent implements OnInit {
  @Input() services: EventService[];

  constructor(
    private auth: AuthService,
    private alert: AlertController,
    private toast: ToastController,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    console.log();
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

  async deleteEventService(eventId: string){
      await this.http.delete('http://localhost:3000/eventservice/'+eventId)
        .subscribe(
          (res)=> {console.log('delete success')},
          (error)=>{ console.log(error)}
        );
      location.reload();
  }

  redirectToDetailPage(serviceId: string) {
    document.location.href = 'http://localhost:4200/start/services/'+serviceId;
  }
}
