import {EventService} from "./eventService.model";

/**
 * This class is used to store the EventServices after fetching them from the database and constructing them.
 * Actually it is probably a bit overkill and an array would have been find as well but fist we thought it would be useful,
 * if we could also store the filter used to get the services from the database.
 */
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

  public toObjectArray(): object[] {
    let res: object[] = [];
    for(const service of this.services) {
      res.push(service.toSimplification());
    }
    return res;
  }

  public reverse() {
    this.services.reverse();
  }

}
