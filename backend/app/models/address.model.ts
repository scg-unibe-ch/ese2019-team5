/**
 * creates an address with street, housenumber, zip and city
 */

export class Address {
  id = -1;
  street: string;
  housenumber: number;
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
  constructor(street: string, housenumber: number, zip: number, city: string){
    this.street = street;
    this.housenumber = housenumber;
    this.zip = zip;
    this.city = city;
  }
  setId(id: number){
    this.id = id;
  }

}
