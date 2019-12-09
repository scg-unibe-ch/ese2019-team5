import {Address} from "./address.model";


/**
 * eventService class constructs an eventService but using the
 * Builder pattern
 */
export class EventService {
  private serviceId: number;
  private _providerId: number;
  private _category: string;
  private _title: string;
  private _description: string;
  private _availability: string;
  private _address: Address;
  private _perimeter: number;
  private _subtype: string;
  private _requirements: string;
  private _capacity: number;
  private _price: number;
  private _image: string;

  /**
   * constructor for an event service object
   * @param serviceId of the service for the event
   * @param providerId userId of the provider
   * @param category of the service such as Music, Venue, Entertainment, Gastronomy and Photography
   * @param title of the service
   * @param description of the service
   * @param address especially for locations
   * @param perimeter of the provider willing to drive or deliver to his customers
   * @param availability of weekdays generally
   * @param requirements for the location or generally to the customer
   * @param subtype of the category
   * @param capacity number of people that can be accustomed/served
   * @param price of the service
   * @param image of the service
   */
  constructor(serviceId: number, providerId: number, category: string, title: string, description: string, address: Address, perimeter: number, availability: string, requirements: string, subtype: string, capacity: number, price: number, image: string) {
    this.serviceId = serviceId;
    this._providerId = providerId;
    this._category = category;
    this._title = title;
    this._description = description;
    this._address = address;
    this._perimeter = perimeter;
    this._availability = availability;
    this._requirements = requirements;
    this._subtype = subtype;
    this._capacity = capacity;
    this._price = price;
    this._image = image;
  }

  /**
   * sets the serviceId
   * @param serviceId
   */
  public setServiceId(serviceId: number) {
    this.serviceId = serviceId;
  }

  /**
   * @return the serviceId
   */
  public getServiceId(): number {
    return this.serviceId;
  }

  /**
   * sets the providerId
   * @param providerId
   */
  public setProviderId(providerId: number) {
    this._providerId = providerId;
    return this;
  }

  /**
   * @return _providerId
   */
  public getProviderId(): number {
    return this._providerId;
  }

  /**
   * sets the category: Venue, Photography, Entertainment, Music or Gastronomy
   * @param category
   */
  public setCategory(category: string) {
    this._category = category;
    return this;
  }

  /**
   * @return _category
   */
  public getCategory(): string {
    return this._category;
  }

  /**
   * sets service title
   * @param title
   */
  public setTitle(title: string) {
    this._title = title;
    return this;
  }

  /**
   * @return title
   */
  public getTitle(): string {
    return this._title;
  }

  /**
   * sets the description of the service
   * @param description
   */
  public setDescription(description: string) {
    this._description = description;
    return this;
  }

  /*
  * @return _description
  */
  public getDescription(): string {
    return this._description;
  }

  /*
  * sets the address where the service will take place or from where the provider operates
  * @param address
  */
  public setAddress(address: Address) {
    this._address = address;
    return this;
  }

  /**
   * @return _address
   */
  public getAddress(): Address {
    return this._address;
  }

  /**
   * sets the the perimeter of the provider willing to drive or deliver to his customers
   * @param perimeter
   */
  public setPerimeter(perimeter: number) {
    this._perimeter = perimeter;
    return this;
  }

  /**
   * @return _perimeter
   */
  public getPerimeter(): number {
    return this._perimeter;
  }

  /**
   * sets the avialability of the provider
   * @param availiability
   */
  public setAvailability(availiability: string) {
    this._availability = availiability;
    return this;
  }

  /**
   * @return _availability
   */
  public getAvailability(): string {
    return this._availability;
  }

  /**
   * sets the requirement for the customer so the provider can provide his service
   * @param requirements
   */
  public setRequirements(requirements: string) {
    this._requirements = requirements;
  }

  /**
   * @return _requirements
   */
  public getRequirements(): string {
    return this._requirements;
  }

  /**
   * sets subtype of the category
   * @param subtype
   */
  public setSubtype(subtype: string) {
    this._subtype = subtype;
  }

  /**
   * @return _subtype
   */
  public getSubtype(): string {
    return this._subtype;
  }

  /**
   * sets the capacity for which the provider is able to deliver/accommodate
   * @param capacity
   */
  public setCapacity(capacity: number) {
    this._capacity = capacity;
    return this;
  }

  /**
   * @return _capacity
   */
  public getCapacity(): number {
    return this._capacity;

  }

  /**
   * sets the price of the service
   * @param price
   */
  public setPrice(price: number) {
    this._price = price;
    return this;
  }

  /**
   * @return _price
   */
  public getPrice(): number {
    return this._price;
  }

  /**
   * sets the image of th service
   * @param image
   */
  public setImage(image: string) {
    this._image = image;
    return this;
  }

  /**
   * @return image
   */
  public getImage(): string {

    return this._image;
  }

  /**
   * simplifies an event service int to separate parts
   * is used to send event services formatted to the front
   */
  public toSimplification(): any {
    return {
      'serviceId': this.getServiceId(),
      'providerId': this.getProviderId(),
      'category': this.getCategory(),
      'title': this.getTitle(),
      'description': this.getDescription(),
      'city': this.getAddress().city,
      'zip': this.getAddress().zip,
      'housenumber': this.getAddress().housenumber,
      'street': this.getAddress().street,
      'perimeter': this.getPerimeter(),
      'availability': this.getAvailability(),
      'requirements': this.getRequirements(),
      'subtype': this.getSubtype(),
      'capacity': this.getCapacity(),
      'price': this.getPrice(),
      'image': this.getImage()

    }


  }
}
