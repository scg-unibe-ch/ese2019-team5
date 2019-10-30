import {Address} from "./address.model";


//TODO hier noch Foto hinzufügen und wahrscheinlich Builder Pattern brauchen
export class EventService {
  category: Categories;
  title: string;
  description: string;
  availability: Weekdays;
  address: Address;
  perimeter: string;

  constructor(category: Categories, title: string,description: string,availability : Weekdays,address: Address, perimeter : string){
    this.category = category;
    this.title= title;
    this.description= description;
    this.availability = availability;
    this.address= address;
    this.perimeter = perimeter;

  }


}
