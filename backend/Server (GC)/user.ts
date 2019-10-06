export class User {
// this class belongs to frontend but is needed by backend
  constructor(
    public email: string,
    public name: string,
    public surname: string,
    public pwhash: string
  ) {}
}

