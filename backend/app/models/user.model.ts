import {Address} from "./address.model";
//import {UserBuilder} from "./userBuilder.model"
import assert from "assert";
import {UserBuilder} from "./userBuilder.model";
//TODO unsicher mit addresse, isFirm und phonenumber.... Wie soll das mit dem FOto gehen.....
export class User {
  id = -1;
  firstname: string;
  lastname: string;
  email: string;
  pwhash: string;
  address: Address;
  isVerified: boolean;
  newUser = false;
  isAdmin = false;
  isFirm = false; //TODO wie anders lösen?? mit Name oder sonst wie?
  phoneNumber = "null";



 constructor(firstname: string, lastname: string, email: string, pwhash: string, isVerified: boolean, address: Address, isFirm: boolean ){//phoneNumber:string) {
  this.firstname= firstname;
  this.lastname= lastname;
  this.email= email;
  this.pwhash=pwhash;
  this.address=address;
  this.isVerified=isVerified;
  this.isFirm=isFirm;
  //this.phoneNumber= phoneNumber;
  }

/* constructor (userBuilder: UserBuilder) {
  this.firstname = userBuilder.firstname;
   this.lastname = userBuilder.lastname;
  this.email = userBuilder.email;
   this.pwhash = userBuilder.pwhash;
   this.address = userBuilder.address;
   this.isFirm = userBuilder.isFirm;
   this.isVerified = userBuilder.isVerified;
 }*/




/**
 * sets the id
 * @param id
 */
setId(id:number)
{
  this.id = id;
}

setPhoneNumber(phoneNumber: string)
{
  this.phoneNumber = phoneNumber;
}

/**
 * returns the user element as string //TODO hier addresse auch hin??
 */
toString(): string
{
  return String(this.id) + ' ' + this.firstname + ' ' + this.lastname + ' ' + this.email + ' ' + this.pwhash;
}

/**
 * returns the firstname and the lastname as string
 */
toNameString():string
{
  return this.firstname + ' ' + this.lastname;
}


}
