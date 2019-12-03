import {Address} from "./address.model";


export class User {
  private _id: number;

  private _firstname: string;
  private _lastname: string;
  private _email: string;
  private _pwhash: string;
  private _address: Address;
  private _isVerified: boolean;
  private _isAdmin: boolean;
  private _isFirm = false; //TODO wie anders lösen?? mit Name oder sonst wie? weg und was ist mit admin
  private _phoneNumber: string;
  private _firmname:string ;
  private _favourite:number[];//TODO stimmt?


  constructor(id:number,firstname: string, lastname: string, email: string, pwhash: string, isVerified: boolean, address: Address, isFirm: boolean, firmname: string, phoneNumber:string, isAdmin:boolean, favourite:number[]) {
   this._id= id;
    this._firstname = firstname;
    this._lastname = lastname;
    this._email = email;
    this._pwhash = pwhash;
    this._address = address;
    this._isVerified = isVerified;
    this._isFirm = isFirm;
    this._firmname=firmname;
    this._phoneNumber= phoneNumber;
    this._isAdmin= isAdmin;
    this._favourite= favourite;//TODO unsicher
  }

  public setFirstname(firstname: string) {
    this._firstname = firstname;
    return this;
  }

  public getFirstname(): string {
    return this._firstname;

  }

  public setLastname(lastname: string) {
    this._lastname = lastname;
    return this;
  }

  public getLastname(): string {
    return this._lastname;

  }

  public setEmail(email: string) {
    this._email = email;
    return this;
  }

  public getEmail(): string {
    return this._email;

  }

  public setPwhash(pwhash: string) {
    this._pwhash = pwhash;
    return this;
  }

  public getPwHash(): string {
    return this._pwhash;

  }

  public setIsFirm(isFirm: boolean) {
    this._isFirm = isFirm;
    return this;
  }

  public getIsFirm(): boolean {
    return this._isFirm;

  }

  public setIsVerified(isVerified: boolean) {
    this._isVerified = isVerified;
    return this;
  }

  public getIsVerified(): boolean {
    return this._isVerified;

  }

  public setAddress(address: Address) {
    this._address = address;
    return this;
  }

  public getAddress(): Address {
    return this._address;

  }

  public setFirmname(firmname: string) {
  this._firmname=firmname;
  }

  public getFirmname(): string {
    return this._firmname;
  }

  /**
   * sets the id
   * @param id
   */
  public setId(id: number) {
    this._id = id;
  }

  public getId(): number {
    return this._id;
  }


  public setPhoneNumber(phoneNumber: string) {
    this._phoneNumber = phoneNumber;
  }

  public getPhoneNumber(): string {
    return this._phoneNumber;
  }

  public setIsAdmin(isAdmin: boolean) {
    this._isAdmin = isAdmin;
    return this;
  }

  public getIsAdmin(): boolean {
    return this._isAdmin;

  }

  public setFavourite(favourite:number[]) {//TODO unsicher
    this._favourite = favourite;
    return this;
  }

  public getFavourite():number[]{//TODO unsicher
   return  this._favourite;
  }


  /**
   * returns the user element as string //TODO hier addresse auch hin??
   */
  toString(): string {
    return String(this.getId()) + ' ' + this.getFirstname() + ' ' + this.getLastname() + ' ' + this.getEmail() + ' ' + this.getPwHash();
  }

  /**
   * returns the firstname and the lastname as string
   */
  toNameString(): string {
    return this.getFirstname() + ' ' + this.getLastname();
  }


/*

  public toJSONObject(): object {
    const userJ =  {
      'firstname': this._firstname,
      'lastname': this._lastname,
      'email': this._email,
      'street': this._address.street,
      'housenumber': String(this._address.housenumber),
      'zip': String(this._address.zip),
      'city': this._address.city};

    return userJ;
  }
*/


}

































/*
   constructor(userBuilder: UserBuilder) {
     this.firstname = userBuilder.firstname;
     this.lastname = userBuilder.lastname;
     this.email = userBuilder.email;
     this.pwhash = userBuilder.pwhash;
     this.address = userBuilder.address;
     this.isFirm = userBuilder.isFirm;
     this.isVerified = userBuilder.isVerified;
   }*/

/*   get firstname(){
     return this.firstname;
   }*/


/**
 * sets the id
 * @param id
 *!/
 setId(id:number)
 {
    this.id = id;
  }

 setPhoneNumber(phoneNumber: string)
 {
    this.phoneNumber = phoneNumber;
  }

 /!**
 * returns the user element as string //TODO hier addresse auch hin??
 *!/
 toString(): string
 {
    return String(this.id) + ' ' + this.firstname + ' ' + this.lastname + ' ' + this.email + ' ' + this.pwhash;
  }

 /!**
 * returns the firstname and the lastname as string
 *!/
 toNameString():string
 {
    return this.firstname + ' ' + this.lastname;
  }


 }
 */

