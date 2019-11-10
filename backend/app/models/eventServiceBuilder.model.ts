import {Address} from "./address.model";
import {EventService} from "./eventService.model";
import {Categories} from "../categories";


const mockAddress: Address = new Address('', 0, 1234, '');


//TODO hier noch Foto hinzufügen und wahrscheinlich Builder Pattern brauchen evt noch Service Id für Cyrill zu erstellen
export class EventServiceBuilder {
  private _serviceId: number;
  private _providerId: number;
  private _category: string;
  private _title: string;
  private _description: string;
  private _address: Address;
  private _perimeter: string;
  private _availability: string;
  private _requirments: string;
  private _subtype: string;
  private _capacity: string;
  private _price: string;
  private _image: Buffer;


  constructor() {
    let availability = '';
    this._serviceId = -1;
    this._providerId = -1;
    this._category = '';
    this._title = '';
    this._description = '';
    this._address = mockAddress;
    this._perimeter = '';
    this._availability = availability;
    this._requirments = '';
    this._subtype = '';
    this._capacity = '0';
    this._price = '0';
    this._image = Buffer.from('');

  }

  public static eventService(): EventServiceBuilder {
    return new EventServiceBuilder();
  }

  public setServiceId(serviceId: number): EventServiceBuilder {
    this._serviceId = serviceId;
    return this;
  }

  public setProviderId(providerId: number): EventServiceBuilder {
    this._providerId = providerId;
    return this;
  }

  public setCategory(category: string): EventServiceBuilder {
    this._category = category;
    return this;
  }

  public setTitle(title: string): EventServiceBuilder {
    this._title = title;
    return this;
  }

  public setDescription(description: string): EventServiceBuilder {
    this._description = description;
    return this;
  }

  public setAddress(address: Address): EventServiceBuilder {
    this._address = address;
    return this;
  }

  public setPerimeter(perimeter: string): EventServiceBuilder {
    this._perimeter = perimeter;
    return this;
  }

  public setAvailability(availiability: string): EventServiceBuilder {
    this._availability = availiability;
    return this;
  }

  public setRequirments(requirments: string): EventServiceBuilder {
    this._requirments = requirments;
    return this;
  }

  public setSubtype(subtype: string): EventServiceBuilder {
    this._subtype = subtype;
    return this;
  }

  public setCapacity(capacity: string): EventServiceBuilder {
    this._capacity = capacity;
    return this;
  }

  public setPrice(price: string): EventServiceBuilder {
    this._price = price;
    return this;
  }

  public setImage(image: Buffer): EventServiceBuilder {
    this._image = image
    return this;
  }


  public build(): EventService {
    let eventService: EventService = new EventService(this._serviceId, this._providerId, this._category, this._title, this._description, this._address, this._perimeter, this._availability, this._requirments, this._subtype, this._capacity, this._price, this._image);
    return eventService;
  }


}
