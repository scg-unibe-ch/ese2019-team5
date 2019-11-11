import {EventServiceContainer} from "../../../../../backend/app/models/eventServiceContainer.model";

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
  allServicesContainer: EventServiceContainer[];
}
