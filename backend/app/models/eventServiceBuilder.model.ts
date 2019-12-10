/**
 * This is the builder class  for an event service
 */
import {Address} from "./address.model";
import {EventService} from "./eventService.model";

const mockAddress: Address = new Address('', '', 1234, '');


export class EventServiceBuilder {
  private _serviceId: number;
  private _providerId: number;
  private _category: string;
  private _title: string;
  private _description: string;
  private _address: Address;
  private _perimeter: number;
  private _availability: string;
  private _requirments: string;
  private _subtype: string;
  private _capacity: number;
  private _price: number;
  private _image: string;

  /**
   * constructor for an event service object with default values
   */
  constructor() {
    let availability = '';
    this._serviceId = -1;
    this._providerId = -1;
    this._category = '';
    this._title = '';
    this._description = '';
    this._address = mockAddress;
    this._perimeter = 0;
    this._availability = availability;
    this._requirments = '';
    this._subtype = '';
    this._capacity = -1;
    this._price = -1;
    this._image = '';

  }

  /**
   * creates a new EventServiceBuilder
   * @return new EventServiceBuilder
   */
  public static eventService(): EventServiceBuilder {
    return new EventServiceBuilder();
  }

  /**
   * sets the serviceId
   * @param serviceId
   */
  public setServiceId(serviceId: number): EventServiceBuilder {
    this._serviceId = serviceId;
    return this;
  }

  /**
   * sets the providerId
   * @param providerId
   */
  public setProviderId(providerId: number): EventServiceBuilder {
    this._providerId = providerId;
    return this;
  }

  /**
   * sets the category: Venue, Photography, Entertainment, Music or Gastronomy
   * @param category
   */
  public setCategory(category: string): EventServiceBuilder {
    this._category = category;
    return this;
  }

  /**
   * sets service title
   * @param title
   */
  public setTitle(title: string): EventServiceBuilder {
    this._title = title;
    return this;
  }

  /**
   * sets the description of the service
   * @param description
   */
  public setDescription(description: string): EventServiceBuilder {
    this._description = description;
    return this;
  }

  /**
   * sets the address where the service will take place or from where the provider operates
   * @param address
   */
  public setAddress(address: Address): EventServiceBuilder {
    this._address = address;
    return this;
  }

  /**
   * sets the the perimeter of the provider willing to drive or deliver to his customers
   * @param perimeter
   */
  public setPerimeter(perimeter: number): EventServiceBuilder {
    this._perimeter = perimeter;
    return this;
  }

  /**
   * sets the availability of the provider
   * @param availiability
   */
  public setAvailability(availiability: string): EventServiceBuilder {
    this._availability = availiability;
    return this;
  }

  /**
   * sets the requirement for the customer so the provider can provide his service
   * @param requirments
   */
  public setRequirments(requirments: string): EventServiceBuilder {
    this._requirments = requirments;
    return this;
  }

  /**
   * sets subtype of the category
   * @param subtype
   */
  public setSubtype(subtype: string): EventServiceBuilder {
    this._subtype = subtype;
    return this;
  }

  /**
   * sets the capacity for which the provider is able to deliver/accommodate
   * @param capacity
   */
  public setCapacity(capacity: number): EventServiceBuilder {
    this._capacity = capacity;
    return this;
  }

  /**
   * sets the price of the service
   * @param price
   */
  public setPrice(price: number): EventServiceBuilder {
    this._price = price;
    return this;
  }

  /**
   * sets the image of th service
   * @param image
   */
  public setImage(image: string): EventServiceBuilder {
    this._image = image
    return this;
  }

  /**
   * builds an event service with all the given parameters
   * @return newly created event service
   */
  public build(): EventService {
    let eventService: EventService = new EventService(this._serviceId, this._providerId, this._category, this._title, this._description, this._address, this._perimeter, this._availability, this._requirments, this._subtype, this._capacity, this._price, this._image);
    return eventService;
  }


}
