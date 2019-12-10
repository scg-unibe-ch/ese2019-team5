/**
 * creates an address with street, housenumber, zip and city
 * is used in the {@link user.model}and {@link eventService.model}
 */

export class Address {
  id = -1;
  street: string;
  housenumber: string;
  zip: number;
  city: string;

  /**
   * constructs an address out of the following parameters
   * @param street
   * @param housenumber
   * @param zip
   * @param city
   * returs an address object
   */
  constructor(street: string, housenumber: string, zip: number, city: string){
    this.street = street;
    this.housenumber = housenumber;
    this.zip = zip;
    this.city = city;
  }

  /**
   * sets the id of an address
   * @param id of the address
   */
  setId(id: number){
    this.id = id;
  }

}
