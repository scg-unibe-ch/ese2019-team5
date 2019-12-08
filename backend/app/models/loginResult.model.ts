import {User} from "./user.model";

/**
 * An LoginResult is returned after the login is verified with the Information stored in the database.
 * It is constructed in the tryLogin method of the db.servcies.ts.
 * It contains the user that loged in to Eventdoo and the JSON webtoken confirming his successful login
 */
export class LoginResult{
  public user: User;
  public token: string;

  constructor(user: User, token: string){
    this.user = user;
    this.token = token;
  }
}
