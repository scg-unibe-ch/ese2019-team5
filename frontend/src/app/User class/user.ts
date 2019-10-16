/**
 * User class
 * Stores all information about a User
 * Initialized by SignupPage
 */

export class User {
  static currentId = 1;
  id: number;
  token?: string;
  email: string;
  password: string;
  valid: boolean;

  constructor(enteredEmail: string, enteredPassword: string){
    this.email = enteredEmail;
    this.password = enteredPassword;
    User.currentId++;
    this.id = User.currentId;
    this.valid = false;
  }
}
