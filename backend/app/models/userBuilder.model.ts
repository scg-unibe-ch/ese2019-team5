import {User} from "./user.model";
import {Address} from "./address.model";

const mockAddress: Address = new Address('', 0, 1234, '')

export class UserBuilder {

  private _id :number;
  private _firstname: string;
  private _lastname: string;
  private _email: string;
  private _pwhash: string;
  private _address: Address;
  private _isVerified: boolean;
  private _isFirm=false;
  private _firmname = ''; //TODO wie anders lösen?? mit Name oder sonst wie?
  private _phonenumber: string;
  private _isAdmin = false;


  constructor() {
    this._id=-1;
    this._firstname = '';
    this._lastname = '';
    this._email = '';
    this._pwhash = '';
    this._address = mockAddress;
    this._isVerified = false;
    this._firmname= '';
    this._phonenumber='0000000000';
    this._isAdmin= false;
  }

  public static user(): UserBuilder {
    return new UserBuilder();
  }

  public setFirstname(firstname: string): UserBuilder {
    this._firstname = firstname;
    return this;
  }

  public setLastname(lastname: string): UserBuilder {
    this._lastname = lastname;
    return this;
  }

  public setEmail(email: string): UserBuilder {
    this._email = email;
    return this;
  }

  public setPwhash(pwhash: string): UserBuilder {
    this._pwhash = pwhash;
    return this;
  }

  public setAddress(address: Address): UserBuilder {
    this._address = address;
    return this;
  }

  public setIsVerified(isVerified: boolean): UserBuilder {
    this._isVerified = isVerified;
    return this;
  }

  public setIsFirm(isFirm:boolean):UserBuilder{
    this._isFirm= isFirm;
    return this;
  }
  public setFirmname(Firmname: string): UserBuilder {
    this._firmname = Firmname;
    return this;
  }

  public setPhonenumber(phonenumber:string):UserBuilder{
    this._phonenumber= phonenumber;
    return this;
  }

  public setId(id:number):UserBuilder{
    this._id= id;
    return this;
  }

  public setIsAdmin(isAdmin:boolean):UserBuilder{
    this._isAdmin= isAdmin;
    return this;
  }

  public build(): User {
    let user: User = new User(this._id,this._firstname, this._lastname, this._email, this._pwhash, this._isVerified, this._address, this._isFirm,this._firmname,this._phonenumber,this._isAdmin);//this._id);
    return user;
  }


}

