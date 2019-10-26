import {Address} from "./address.model";
//TODO unsicher mit addresse
export class User {

  id = -1;
  firstname: string;
  lastname: string;
  email: string;
  pwhash: string;
 // address: Address;
  isVerified: boolean;
  newUser = false;
  isAdmin = false;

  constructor(firstname: string, lastname: string, email: string, pwhash: string,isVerified: boolean) { //TODO addresse hier einfügen nach pwhash???
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.pwhash = pwhash;
   // this.address= address;
    this.isVerified = isVerified;
  }

  /**
   * sets the id
   * @param id
   */
  setId(id: number) {
    this.id = id;
  }

  /**
   * returns the user element as string //TODO hier addresse auch hin??
   */
  toString(): string {
    return String(this.id) + ' ' + this.firstname + ' ' + this.lastname + ' ' + this.email + ' ' + this.pwhash;
  }

  /**
   * returns the firstname and the lastname as string
   */
  toNameString(): string {
    return this.firstname + ' ' + this.lastname;
  }

}
