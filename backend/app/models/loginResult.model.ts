import {User} from "./user.model";

export class LoginResult{
  public user: User;
  public token: string;

  constructor(user: User, token: string){
    this.user = user;
    this.token = token;
  }
}
