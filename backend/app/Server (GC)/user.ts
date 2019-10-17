export class User {
// this class belongs to frontend but is needed by backend wie genau is false als standard wert geben?
  constructor(
    public email: string,
    public name: string,
    public surname: string,
    public pwhash: string,
    public isVerified: boolean,
  ) {}
}

