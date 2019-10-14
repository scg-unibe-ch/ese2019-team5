export class User {

  id = -1;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  newUser = false;

  constructor(id: number, firstname: string, lastname: string, email: string, password: string) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }


  toString(): string {
    return String(this.id) + ' ' + this.firstname + ' ' + this.lastname + ' ' + this.email + ' ' + this.password;
  }

  toNameString(): string {
    return this.firstname + ' ' + this.lastname;
  }

}
