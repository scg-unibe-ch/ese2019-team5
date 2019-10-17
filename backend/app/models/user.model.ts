export class User {

  id = -1;
  firstname: string;
  lastname: string;
  email: string;
  pwhash: string;
  isVerified: boolean;
  newUser = false;
  isAdmin = false;

  constructor(firstname: string, lastname: string, email: string, pwhash: string, isVerified: boolean) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.pwhash = pwhash;
    this.isVerified = isVerified;
  }

  setId(id: number) {
    this.id = id;
  }

  toString(): string {
    return String(this.id) + ' ' + this.firstname + ' ' + this.lastname + ' ' + this.email + ' ' + this.pwhash;
  }

  toNameString(): string {
    return this.firstname + ' ' + this.lastname;
  }

}
