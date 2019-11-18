import {EventServiceContainer} from "../../../../../backend/app/models/eventServiceContainer.model";
import {EventService} from "../../../../../backend/app/models/eventService.model";

export interface userJson{
  firstname: string;
  lastname: string;
  email:string;
  street: string;
  housenumber: string;
  zip: string;
  city: string;
  firmname: string;
  phonenumber: string;
  eventServiceArrayOfUser: EventService[];
  size: number;
}
