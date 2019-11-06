import {EventService} from "./eventService.model";

export class EventServiceContainer {
  private services: EventService[];

  constructor (services: EventService[]){
    this.services = services;
  }

  public getServices(): EventService[] {
    return this.services;
  }

  public addService(service: EventService) {
    this.services.push(service);
  }

}
