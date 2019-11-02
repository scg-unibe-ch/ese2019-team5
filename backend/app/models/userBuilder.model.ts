import {User} from "./user.model";
import {Address} from "./address.model";
const mockAddress:Address=new Address('',0,1234,'')




export class UserBuilder {
  private _firstname: string= '';
  private _lastname: string= '';
  private _email: string= '';
  private _pwhash: string= '';
  private _address: Address=mockAddress;
  private _isVerified: boolean=false;
  private _isFrim: boolean=false;
  private _phoneNumber: string='0000000000';

  constructor(firstname:string,lastname:string){
    this._firstname=firstname;
    this._lastname=lastname;
  } ;

 // public  build (): User{
 /* assert firstname!=null;
  assert lastname!=null;
  assert email!=null;
  assert pwhash!=null;
*/
//  let user: User= new User(this);//firstname:string, lastname: string, email: string, pwhash: string, isFirm: boolean);
//  return user;



  public setEmail (email:string){
    this._email= email;
    return this;
  }
  public setPwhash (pwhash:string){
    this._pwhash= pwhash;
    return this;
  }

  public setisFirm (isFirm:boolean){
    this._isFrim= isFirm;
    return this;
  }
  public setAddress (address:Address){
    this._address= address;
    return this;
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
