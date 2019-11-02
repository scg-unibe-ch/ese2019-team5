import {User} from "./user.model";
import {Address} from "./address.model";

const mockAddress: Address = new Address('', 0, 1234, '')

export class UserBuilder {

  private id = -1;
  private _firstname: string;
  private _lastname: string;
  private _email: string;
  private _pwhash: string;
  private _address: Address;
  private _isVerified: boolean;
  private _newUser = false;
  private _isAdmin = false;
  private _isFirm = false; //TODO wie anders lösen?? mit Name oder sonst wie?
  private phoneNumber = "null";

  /*private _firstname: string= '';
    private _lastname: string= '';
    private _email: string= '';
    private _pwhash: string= '';
    private _address: Address=mockAddress;
    private _isVerified: boolean=false;
    private _isFrim: boolean=false;
    private _phoneNumber: string='0000000000';*/

  /* constructor(firstname:string,lastname:string){
     this._firstname=firstname;
     this._lastname=lastname;
   }

  public  build (): User{
  /!* assert firstname!=null;
   assert lastname!=null;
   assert email!=null;
   assert pwhash!=null;
 *!/
   return new User(this);//firstname:string, lastname: string, email: string, pwhash: string, isFirm: boolean);
   }


 */

  constructor() {
    this._firstname = '';
    this._lastname = '';
    this._email = '';
    this._pwhash = '';
    this._address = mockAddress;
    this._isVerified = false;
    this._isFirm = false;
    // this._phoneNumber='0000000000';
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

  public setIsFirm(isFirm: boolean): UserBuilder {
    this._isFirm = isFirm;
    return this;
  }

  public build(): User {
    let user: User = new User(this._firstname, this._lastname, this._email, this._pwhash, this._isVerified, this._address, this._isFirm);
    return user;
  }


}


/*
  public setEmail (email:string){
    this.email= email;
    return this;
  }

  public getEmail(): string {
   return this.email;

  }
  public setPwhash (pwhash:string){
    this.pwhash= pwhash;
    return this;
  }
  public getPwHash(): string {
    return this.pwhash;

  }

  public setIsFirm (isFirm:boolean){
    this.isFrim= isFirm;
    return this;
  }

  public getIsFirm(): boolean {
    return this.isFrim;

  }
  public setAddress (address:Address){
    this.address= address;
    return this;
  }
  public getAddress(): Address {
    return this.address;

  }
  public build(){
  return new User(this);
  }
}

/*private export class UserBuilder{
  // private firstname: string;
  // private lastname: string;
  // private email: string;
  // private pwhash: string;
  // private address: Address;
  // private isVerified: boolean;
  // private isFrim: boolean;
  // private phoneNumber: string;

  constructor(){} ;

  public  build (): User{
    /* assert firstname!=null;
     assert lastname!=null;
     assert email!=null;
     assert pwhash!=null;
   */
/*
let user: User= new User(firstname, lastname, email, pwhash, isFirm: boolean);
return user;
}

public setFirstname (firstname:string):UserBuilder{
  this.firstname= firstname;
  return this;
}

public setLastname (lastname:string):UserBuilder{
  this.lastname= lastname;
  return this;
}
public setEmail (email:string):UserBuilder{
  this.email= email;
  return this;
}
public setPwhash (pwhash:string):UserBuilder{
  this.pwhash= pwhash;
  return this;
}


public setisFirm (isFirm:boolean):UserBuilder{
  this.isFrim= isFirm;
  return this;
}
public setAddress (address:Address):UserBuilder{
  this.address= address;
  return this;
}
}*/
