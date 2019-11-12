import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../../../../backend/app/models/eventService.model";
import {Address} from "../../../../../../backend/app/models/address.model";

@Component({
  selector: 'event-service-card',
  templateUrl: './event-service-card.component.html',
  styleUrls: ['./event-service-card.component.scss'],
})

export class EventServiceCardComponent implements OnInit {
  @Input() services: EventService[];

  constructor() {
  }

  ngOnInit() {}

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

}
