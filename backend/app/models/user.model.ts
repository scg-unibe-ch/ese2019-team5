/**
 * This class creates a user it uses {@link Address}
 * Here together with the {@link UserBuilder} the Builder Pattern is used
 */

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
  private _isFirm = false;
  private _phoneNumber: string;
  private _firmname:string ;
  private _favourite:number[];

  /**
   * constructs a user
   * @param id of the user
   * @param firstname of the user
   * @param lastname of the user
   * @param email of the user
   * @param pwhash hashed password of the user
   * @param isVerified whether the email address is verified
   * @param address of the user
   * @param isFirm whether it is a firm
   * @param firmname if the user is a firm
   * @param phoneNumber of the user
   * @param isAdmin if the user is an admin
   * @param favourite eventservices of the user
   */
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
    this._favourite= favourite;
  }

  /**
   * sets the firstname
   * @param firstname
   */
  public setFirstname(firstname: string) {
    this._firstname = firstname;
    return this;
  }

  /**
   * @return _firstname
   */
  public getFirstname(): string {
    return this._firstname;
  }

  /**
   * sets the lastname of the user
   * @param lastname
   */
  public setLastname(lastname: string) {
    this._lastname = lastname;
    return this;
  }

  /**
   * @return _lastname
   */
  public getLastname(): string {
    return this._lastname;
  }

  /**
   * set the email address of the user
   * @param email
   */
  public setEmail(email: string) {
    this._email = email;
    return this;
  }

  /**
   * @return _email
   */
  public getEmail(): string {
    return this._email;
  }

  /**
   * set the hashed password of the user
   * @param pwhash
   */
  public setPwhash(pwhash: string) {
    this._pwhash = pwhash;
    return this;
  }

  /**
   * @return _pwhash
   */
  public getPwHash(): string {
    return this._pwhash;
  }

  /**
   * sets whether the user is a firm
   * @param isFirm
   */
  public setIsFirm(isFirm: boolean) {
    this._isFirm = isFirm;
    return this;
  }

  /**
   * @return boolean if user is firm or not
   */
  public getIsFirm(): boolean {
    return this._isFirm;
  }

  /**
   * sets whether user email address is verified or not
   * @param isVerified
   */
  public setIsVerified(isVerified: boolean) {
    this._isVerified = isVerified;
    return this;
  }

  /**
   * @return boolean if user email address is verified or not
   */
  public getIsVerified(): boolean {
    return this._isVerified;
  }

  /**
   * set the address of the user
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
   * sets the firmname
   * @param firmname
   */
  public setFirmname(firmname: string) {
  this._firmname=firmname;
  }

  /**
   * @return _firmname
   */
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

  /**
   * @return _id
   */
  public getId(): number {
    return this._id;
  }

  /**
   * sets the users phone number
   * @param phoneNumber
   */
  public setPhoneNumber(phoneNumber: string) {
    this._phoneNumber = phoneNumber;
  }

  /**
   * @return _phoneNumber
   */
  public getPhoneNumber(): string {
    return this._phoneNumber;
  }

  /**
   *  sets whether the user is an admin
   * @param isAdmin
   */
  public setIsAdmin(isAdmin: boolean) {
    this._isAdmin = isAdmin;
    return this;
  }

  /**
   * @return boolean if user is admin
   */
  public getIsAdmin(): boolean {
    return this._isAdmin;
  }

  /**
   * sets favourite event services of user
   * @param favourite
   */
  public setFavourite(favourite:number[]) {
    this._favourite = favourite;
    return this;
  }

  /**
   * @return _favourite
   */
  public getFavourite():number[]{
   return  this._favourite;
  }


}
