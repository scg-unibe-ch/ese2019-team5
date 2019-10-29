import {Client} from 'ts-postgres';
import {SqlResult} from '../models/sqlresult.model';
import {User} from '../models/user.model';
import * as fs from 'fs';
import {LoginResult} from "../models/loginResult.model";
import {Address} from "../models/address.model";

const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync('./app/services/private.key', 'utf8');
const clientKey = fs.readFileSync('./app/services/client-key.pem').toString();
const clientCert = fs.readFileSync('./app/services/client-cert.pem').toString();
const serverCA = fs.readFileSync('./app/services/server-ca.pem').toString();

export class DbServices {

  /**
   * returns an Client to connect to our database
   */
    private getClient(): Client {

      const config = {
        'user' : 'cyrill',
        'host' : '34.65.95.137',
        //'host' : 'localhost',
        'password' : 'eseTeam5_2019!',
        'port' : 5432,
        'database' : 'eventdoo',
      };
    //console.log(config);
      return new Client(config);
    }

    // test function
    public async testAddress(street: string, number:number, zip: number, city: string): Promise<Number> {
      const localClient = this.getClient();
      await localClient.connect();
      try{
        const id = await this.checkIfAddressExistsAndCreate(street,number,zip,city, localClient);
        return id;
      } finally {
        await localClient.end();
      }
    }

    // This function is only for testing purpose
    public async getSqlResult(name: string): Promise<SqlResult> {
      const localClient = this.getClient();
      await localClient.connect();
      try{
        return await this.testSql(name, localClient);
      } finally {
        await localClient.end();
      }
    }

  /**
   * takes an eamil-address and retruns the user with this email from the database
   * @param email of an user as string
   */
  public async getUserFromEmail(email: string): Promise<User> {

      const localClient = this.getClient();


      await localClient.connect();
      try{
        return await this.getUserFromEmailDB(email, localClient);
      } finally {
        await localClient.end();
      }
    }

  /**
   * tries to login a user with given email and password. Therefore it takes the email address and searches with
   * the getUserFromEmail method the corresponding user.
   * If the login credentials are correct, it returns an LoginResult object wich contains the user as well as the JSON web token
   * @param email
   * @param password, hashed password as string as received from the frontend
   */
    public async tryLogin(email: string, password: string): Promise<LoginResult> {
      let user: User;
      user = await this.getUserFromEmail(email);
      if (this.checkIfPasswordCorrect(user, password)) {
        if (this.isUserVerified(user)) {
          return new LoginResult(user,this.generateJWT(email, user.id));
        } else {
          throw Error('To login, please verify your email-address');
        }
      } else {
        throw Error('Invalid email-address or password');
      }
    }

  /**
   * signs up an user in the db. Therefore it checks if the email already exists in the database. If not
   * then the method to enter the entry in the database is called
   * @param user as User object.
   */
  public async signUp(user: User): Promise<number>{
      const localClient = this.getClient();
      await localClient.connect();
      var id = -1;
      try {
        if(await this.checkIfMailIsUniqueDB(user.email, localClient)){
          id = Number(await this.creatUserInDB(user, localClient));
          user.setId(id);
        } else {
          throw Error('The email address already exists in the database');
        }
      } finally {
        await localClient.end();
      }
      return id;
    }

  /**
   * searches the user via email in the database and then calls the method makeUserVerifiedDB which sets the isverified
   * in the database to true
   * @param email
   */
  public async makeUserVerified(email: string){
      const localClient = this.getClient();
      await localClient.connect();
      try {
        const user = await this.getUserFromEmailDB(email, localClient);
        await this.makeUserVerifiedDB(user, localClient);
      } finally {
        await localClient.end();
      }
    }


  /**
   * sets the isverified of an user in the database to true
   * @param user as UserObject
   * @param client to use to connect to the database
   */
    private async makeUserVerifiedDB(user: User, client: Client){
      await client.query('Update users Set isverified=true Where id = $1', [user.id])
    }

  /**
   * inserts a given user to the database
   * @param user as User Object
   * @param client to use to connect to the database
   */
    private async creatUserInDB(user: User, client: Client): Promise<number>{

      //const addressId = await this.checkIfAddressExistsAndCreate(user.address.street, user.address.housenumber, user.address.zip, user.address.city, client);

      const addressId = Number(await this.checkIfAddressExistsAndCreate(user.address.street, user.address.housenumber, user.address.zip, user.address.city, client));
      const stream = client.query('Insert into users(prename, lastname, email, password, isverified, addressid, isfirm) Values ($1,$2,$3,$4,$5,$6,$7) Returning id As id',[user.firstname, user.lastname, user.email, user.pwhash, user.isVerified, addressId, user.isFirm]);

      var id = -1;
      for await (const row of stream){
        id = Number(row.get('id'));

      }
      if(id == -1) {
        console.log("hello");
        throw Error('An error occured while creating the DB entry');
      }

      return id;
    }

    /**
     * takes an email address and checks if an user is allready using this address
     * @param email-address of new User
     */
    private async checkIfMailIsUniqueDB(email: string, client: Client) : Promise<boolean>{
      const stream = client.query('SELECT email As email FROM users Where email = $1', [email]);
      var counter = 0;
      for await(const row of stream){
        counter ++;
      }
      return (counter == 0);
    }


  /**
   * generates an JSON webtoken out of the eamil address and userid
   * @param email
   * @param userId
   */
    private generateJWT(email: string, userId: number): string {
      const payload = {
        data1: String(userId),
      };
      const signOption = {
        issuer: 'Eventdoo',
        audience: 'http://eventdoo.ch',
        subject: email,
        expiresIn: '7d',
        algorithm: 'RS256'
      };
      return jwt.sign(payload, privateKey, signOption);
    }

  /**
   * helper method that compares an given string password with the password stored in the user
   * @param user
   * @param password
   */
    private checkIfPasswordCorrect(user: User, password: string): boolean {
      return password == user.pwhash;
    }

  /**
   * helper method that return true if the isVerified attribute of the user is true
   * @param user
   */
  private isUserVerified(user: User): boolean {
        return user.isVerified;
    }

    /**
     * returns the user from a given email. It therefore searches the database for the user and creates an User Object
     * from this given information
     * @param email
     * @param client to use to connect to the database
     */
    // @ts-ignore
    private async getUserFromEmailDB(email: string, client: Client): Promise<User> {
      let user: User;

      const stream = client.query('SELECT id As id, prename As pn, lastname As ln, email As email, password As pw, isverified As isv, isFirm As isf, phonenumber As phone, addressId As aid From users Where email = $1', [email]);

      for await(const row of stream) {
        if (stream.rows == null) {
          throw new Error('no user with this email found');
        } else if (stream.rows.length !== 1) {
          throw new Error('this email isnt unique in the database');
        } else {

          const address = await this.getAddressFromAId(Number(row.get('aid')), client);

          user = new User(String(row.get('pn')), String(row.get('ln')), String(row.get('email')), String(row.get('pw')), Boolean(row.get('isv')), address,Boolean(row.get('isf')));
          user.setId(Number(row.get('id')));
          return user;
        }
      }
      throw new Error('no user with this email found');
    }

    private async getAddressFromAId(addressId: number, client: Client): Promise<Address>{
      let address: Address;
      const stream = client.query('Select id, street, number, zip, city From address Where id = $1', [addressId]);
      for await(const row of stream){
        if (stream.rows == null){
          throw new Error('no address with this id found');
        } else {
          address = new Address(String(row.get('street')),Number(row.get('number')), Number(row.get('zip')), String(row.get('city')));
          address.setId(addressId);
          return address;
        }
      }
      throw new Error('no address with this id found');
    }

    private async checkIfAddressExistsAndCreate(street: string, number:number, zip: number, city: string, client: Client): Promise<Number> {
      var stream = client.query('Select id From address Where street = $1 And number = $2 And zip = $3 And city = $4',[street, number, zip, city]);

      for await (const row of stream){
        return Number(row.get('id'));
      }



      stream = client.query('Insert into address(street, number, zip, city) Values ($1,$2,$3,$4) Returning id As id',[street, number, zip, city]);

      for await (const row of stream) {
        return Number(row.get('id'));
      }

      console.log("hello");

      throw Error('address not found and error while inserting');
    }

    // for testing only... returns all the users with given lastname
    async testSql(name: string, client: Client): Promise<SqlResult> {
        const sqlResult = new SqlResult();

        const stream = client.query('SELECT id As id, prename As pn, lastname As ln, email As email, password As pw, isverified As isv, isFirm As isf, phonenumber As phone, addressId As aid From users Where lastname = $1', [name]);

        for await (const row of stream) {

            if (stream.rows == null) {
                throw new Error('no result found in database');
            }
            // tslint:disable-next-line:max-line-length
            const address = await this.getAddressFromAId(Number(row.get('aid')), client);

            const user = new User(String(row.get('pn')), String(row.get('ln')), String(row.get('email')), String(row.get('pw')), Boolean(row.get('isv')), address,Boolean(row.get('isf')));
            user.setId(Number(row.get('id')));
            // tslint:disable-next-line:max-line-length
            sqlResult.addUser(user);
        }

      // tslint:disable-next-line:max-line-length

        return sqlResult;
    }

}



