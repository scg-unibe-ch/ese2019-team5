import {Address} from "./address.model";


//TODO hier noch Foto hinzufügen und wahrscheinlich Builder Pattern brauchen evt noch Service Id für Cyrill zu erstellen
export class EventService {
  providerId:number;
  category: Categories;
  title: string;
  description: string;
  availability: Weekdays;
  address: Address;
  perimeter: string;

  constructor(providerId: number,category: Categories, title: string,description: string,availability : Weekdays,address: Address, perimeter : string){
    this.providerId= providerId;
    this.category = category;
    this.title= title;
    this.description= description;
    this.availability = availability;
    this.address= address;
    this.perimeter = perimeter;

  }


}
