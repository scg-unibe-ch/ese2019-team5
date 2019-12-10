import {User} from "./user.model";
import {Address} from "./address.model";

/**
 * This is the builder class for the user so it is easier to add all the parameters
 * instead of having them all separate in the constructor
 */
const mockAddress: Address = new Address('', '', 1234, '');

export class UserBuilder {

  private _id :number;
  private _firstname: string;
  private _lastname: string;
  private _email: string;
  private _pwhash: string;
  private _address: Address;
  private _isVerified: boolean;
  private _isFirm=false;
  private _firmname = '';
  private _phonenumber: string;
  private _isAdmin = false;
  private _favourite: number[];

  /**
   * constructs a user with devfault values
   */
  constructor() {
    this._id=-1;
    this._firstname = '';
    this._lastname = '';
    this._email = '';
    this._pwhash = '';
    this._address = mockAddress;
    this._isVerified = false;
    this._firmname= '';
    this._phonenumber='';
    this._isAdmin= false;
    this._favourite=[];
  }

  /**
   * creates a new UserBuilder
   * @return new UserBuilder
   */
  public static user(): UserBuilder {
    return new UserBuilder();
  }

  /**
   * sets the firstname
   * @param firstname
   */
  public setFirstname(firstname: string): UserBuilder {
    this._firstname = firstname;
    return this;
  }

  /**
   * sets the lastname of the user
   * @param lastname
   */
  public setLastname(lastname: string): UserBuilder {
    this._lastname = lastname;
    return this;
  }

  /**
   * set the email address of the user
   * @param email
   */
  public setEmail(email: string): UserBuilder {
    this._email = email;
    return this;
  }

  /**
   * set the hashed password of the user
   * @param pwhash
   */
  public setPwhash(pwhash: string): UserBuilder {
    this._pwhash = pwhash;
    return this;
  }

  /**
   * set the address of the user
   * @param address
   */
  public setAddress(address: Address): UserBuilder {
    this._address = address;
    return this;
  }

  /**
   * sets whether user email address is verified or not
   * @param isVerified
   */
  public setIsVerified(isVerified: boolean): UserBuilder {
    this._isVerified = isVerified;
    return this;
  }

  /**
   * sets whether the user is a firm
   * @param isFirm
   */
  public setIsFirm(isFirm:boolean):UserBuilder{
    this._isFirm= isFirm;
    return this;
  }

  /**
   * sets the firmname
   * @param firmname
   */
  public setFirmname(Firmname: string): UserBuilder {
    this._firmname = Firmname;
    return this;
  }

  /**
   * sets the users phone number
   * @param phoneNumber
   */
  public setPhonenumber(phonenumber:string):UserBuilder{
    this._phonenumber= phonenumber;
    return this;
  }

  /**
   * sets the id
   * @param id
   */
  public setId(id:number):UserBuilder{
    this._id= id;
    return this;
  }

  /**
   *  sets whether the user is an admin
   * @param isAdmin
   */
  public setIsAdmin(isAdmin:boolean):UserBuilder{
    this._isAdmin= isAdmin;
    return this;
  }

  /**
   * sets favourite event services of user
   * @param favourite
   */
  public setFavourite(favourite:number[]):UserBuilder{
    this._favourite= favourite;
    return this;
  }

  /**
   * builds the user with all the given attributes
   * @returns user, newly created user
   */
  public build(): User {
    let user: User = new User(this._id,this._firstname, this._lastname, this._email, this._pwhash, this._isVerified, this._address, this._isFirm,this._firmname,this._phonenumber,this._isAdmin, this._favourite);//this._id);
    return user;
  }


}

