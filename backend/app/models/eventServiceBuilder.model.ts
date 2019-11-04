import {Address} from "./address.model";
import {EventService} from "./eventService.model";
import {Categories} from "../categories";
import {Weekdays} from "../weekdays";

const mockAddress: Address = new Address('', 0, 1234, '');


//TODO hier noch Foto hinzufügen und wahrscheinlich Builder Pattern brauchen evt noch Service Id für Cyrill zu erstellen
export class EventServiceBuilder {
  private _providerId: number;
  private _category: Categories;
  private _title: string;
  private _description: string;
  private _availability: Weekdays[];
  private _address: Address;
  private _perimeter: string;


  constructor() {
    let availability: Weekdays[]= [Weekdays.NoDay];
    this._providerId = -1;
    this._category = Categories.none;
    this._title = '';
    this._description = '';
    this._availability = availability ;
    this._address = mockAddress;
    this._perimeter = 'zero km';

  }
  public static eventService(): EventServiceBuilder{
    return new EventServiceBuilder();
  }
  public setProviderId(providerId: number): EventServiceBuilder {
    this._providerId = providerId;
    return this;
  }


  public setTitle(title: string): EventServiceBuilder {
    this._title = title;
    return this;
  }

  public setCategory(category: Categories): EventServiceBuilder {
    this._category = category;
    return this;
  }

  public setDescription(description: string): EventServiceBuilder {
    this._description= description;
    return this;
  }

  public setAvailability(availiability: Weekdays[]): EventServiceBuilder {
    this._availability = availiability;
    return this;
  }

  public setAddress(address: Address): EventServiceBuilder {
    this._address = address;
    return this;
  }


  public setPerimeter(perimeter:string):EventServiceBuilder{
    this._perimeter= perimeter;
    return this;
  }



  public build(): EventService {
    let eventService: EventService = new EventService(this._providerId, this._category, this._title, this._description, this._availability, this._address, this._perimeter);
    return eventService;
  }



}
