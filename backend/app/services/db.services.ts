import {Client, ResultIterator} from 'ts-postgres';
import {SqlResult} from '../models/sqlresult.model';
import {User} from '../models/user.model';
import * as fs from 'fs';
import {LoginResult} from "../models/loginResult.model";
import {Address} from "../models/address.model";
import {EventService} from "../models/eventService.model";
import {FileHandlerService} from "./fileHandler.service";
import {EventServiceContainer} from "../models/eventServiceContainer.model";
import {EventServiceBuilder} from "../models/eventServiceBuilder.model";

import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {UserBuilder} from "../models/userBuilder.model";
import {FilterCategories} from "../models/filterCategories.enum";

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

  public async addEventService(service: EventService){
    const fileHandler = new FileHandlerService();

    const localClient = this.getClient();
    await localClient.connect();

    try{
      const serviceId = await this.addServiceToDB(service, localClient);
      fileHandler.safeServicePictures(service.getImage(),serviceId);
    } finally{
      await localClient.end()
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
        return await this.getUserFromDB(email, null, localClient);
      } finally {
        await localClient.end();
      }
  }

  public async getUserFromId(id: number): Promise<User> {


    const localClient = this.getClient();

    await localClient.connect();
    try{
      return await this.getUserFromDB(null, id, localClient);
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
        return new LoginResult(user,this.generateJWT(email, user.getId()));
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
        if(await this.checkIfMailIsUniqueDB(user.getEmail(), localClient)){
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
        const user = await this.getUserFromDB(email,null, localClient);
        await this.makeUserVerifiedDB(user, localClient);
      } finally {
        await localClient.end();
      }
  }

  public async updateUser(user: User){
    const localClient = this.getClient();
    await localClient.connect();
    try{
      await this.updateUserDB(user,localClient);
    } finally {
      await localClient.end();
    }
  }

  public async getAllServices(): Promise<EventServiceContainer> {
    const localClient = this.getClient();
    await localClient.connect();
    try{
      return await this.getServiceFromDB([],localClient);
    } finally {
      await localClient.end();
    }
  }

  public async getServiceFilter(filter: EventServiceFilter[]){
    const localClient = this.getClient();
    await localClient.connect();
    try{
      return await this.getServiceFromDB(filter, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async getServiceFromId(serviceId: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getServiceFromDB([new EventServiceFilter(FilterCategories.serviceId, serviceId)], localClient);
    } finally {
      await localClient.end();
    }
  }

  public async deleteUser(userId: number){
    const localClient = this.getClient();
    await localClient.connect();
    try{
      return await this.deleteUserFromDB(userId, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async deleteService(serviceId: number){
    const localClient = this.getClient();
    await localClient.connect();
    try{
      return await this.deleteServiceFromDB(serviceId, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async resetPassword(email: string, newPW: string) {
    const localClient = this.getClient();
    await localClient.connect();
    try{
      return await this.resetPasswordDB(email, newPW, localClient);
    } finally {
      await localClient.end();
    }
  }


  /////////////////////       from here on down are the private helper methods that connect to the database       \\\\\\\\\\\\\\\\\\\\\\\\\\\



  /**
   * sets the isverified of an user in the database to true
   * @param user as UserObject
   * @param client to use to connect to the database
   */
  private async makeUserVerifiedDB(user: User, client: Client){
    await client.query('Update users Set isverified=true Where id = $1', [user.getId()])
  }

  /**
   * inserts a given user to the database
   * @param user as User Object
   * @param client to use to connect to the database
   */
  private async creatUserInDB(user: User, client: Client): Promise<number>{

    //const addressId = await this.checkIfAddressExistsAndCreate(user.address.street, user.address.housenumber, user.address.zip, user.address.city, client);

    const addressId = Number(await this.checkIfAddressExistsAndCreate(user.getAddress().street, user.getAddress().housenumber, user.getAddress().zip, user.getAddress().city, client));
    const stream = client.query('Insert into users(prename, lastname, email, password, isverified, addressid, isfirm) Values ($1,$2,$3,$4,$5,$6,$7) Returning id As id',[user.getFirstname(), user.getLastname(), user.getEmail(), user.getPwHash(), user.getIsVerified(), addressId, user.getIsFirm()]);

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

  private async updateUserDB(user: User, client: Client){

    const addressId = Number(await this.checkIfAddressExistsAndCreate(user.getAddress().street, user.getAddress().housenumber, user.getAddress().zip, user.getAddress().city, client));

    const stream = client.query('SELECT addressid FROM users WHERE id=$1',[user.getId()]);
    let oldAddressId = -1;
    for await (const row of stream){
      oldAddressId = Number(row.get('addressid'));

    }

    if (oldAddressId == -1) {
      throw Error("An error occured while getting the old address id of updated user")
    }

    await client.query('UPDATE users SET prename=$1, lastname=$2, addressid=$3, isfirm=$4, phonenumber=$5, firmname=$6 WHERE id=$7',[user.getFirstname(), user.getLastname(),addressId, user.getIsFirm(), user.getPhoneNumber(), user.getFirmname(), user.getId()]);

    this.searchForAddressUsageAndDelete(oldAddressId, client);

  }

  private async getUserFromDB(email: string | null, id: number | null, client: Client): Promise<User> {
    let user: User;
    let stream: ResultIterator;


    if(id == null) {
      stream = client.query('SELECT * From users Where email = $1', [email]);
    }else {
      stream = client.query('SELECT * From users Where id = $1', [id]);
    }


    for await(const row of stream) {
      if (stream.rows == null) {
        throw new Error('no user with this email found');
      } else if (stream.rows.length !== 1) {
        throw new Error('this email isnt unique in the database');
      } else {

        const address = await this.getAddressFromAId(Number(row.get('addressid')), client);

        user = new UserBuilder()
          .setId(Number(row.get('id')))
          .setFirstname(String(row.get('prename')))
          .setLastname(String(row.get('lastname')))
          .setEmail(String(row.get('email')))
          .setPwhash(String(row.get('password')))
          .setIsVerified(Boolean(row.get('isverified')))
          .setAddress(address)
          .setIsFirm(Boolean(row.get('isfirm')))
          .setPhonenumber(String(row.get('phonenumber')))
          .setFirmname(String(row.get('firmname')))
          .build();

        return user;
      }
    }
    throw new Error('no user with this email found');
  }

  private async deleteUserFromDB(userId: number, client: Client) {
    const stream = client.query('SELECT addressid FROM users WHERE id=$1',[userId]);
    let oldAddressId = -1;
    for await (const row of stream){
      oldAddressId = Number(row.get('addressid'));
    }

    if (oldAddressId == -1) {
      throw Error("an error occured while getting the old address id of updated user")
    }

    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    await this.searchForAddressUsageAndDelete(oldAddressId, client);
  }

  private async resetPasswordDB(email: string, newPW: string, client: Client) {
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [newPW, email]);
    console.log("passwort reset");
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
    return password == user.getPwHash();
  }

  /**
   * helper method that return true if the isVerified attribute of the user is true
   * @param user
   */
  private isUserVerified(user: User): boolean {
        return user.getIsVerified();
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

    throw Error('address not found and error while inserting');
  }

  private async searchForAddressUsageAndDelete(addressId: number, client: Client){
    const stream = await client.query('Select users.id FROM users WHERE addressid=$1 UNION SELECT service.id FROM service WHERE addressid=$1',[addressId]);
    if (stream.rows.length == 0){
      await client.query('Delete From address Where id = $1', [addressId])
    }
  }




  private async addServiceToDB(service: EventService, client: Client): Promise<number>{

    const address = service.getAddress();

    const addressId = Number(await this.checkIfAddressExistsAndCreate(address.street, address.housenumber, address.zip, address.city, client));

    const stream = client.query('Insert into service(userid, category, title, description, addressid, radius, availability, requirements, subtype, capacity, price) Values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) Returning id',[
      service.getProviderId(),
      service.getCategory(),
      service.getTitle(),
      service.getDescription(),
      addressId,
      service.getPerimeter(),
      service.getAvailability(),
      service.getRequirements(),
      service.getSubtype(),
      service.getCapacity(),
      service.getPrice()
    ]);

    for await (const row of stream) {
      service.setServiceId(Number(row.get('id')));
      return Number(row.get('id'));
    }

    throw Error ('an unknown error occured while creating the database entry of the eventService');
  }


  private async getServiceFromDB(filterArray: EventServiceFilter[], client: Client) : Promise<EventServiceContainer>{
    const container = new EventServiceContainer([]);

    let query = 'SELECT * FROM service';
    let qArray = [];
    let qCount = 1;

    let flag = false;
    for(const filter of filterArray) {
      if (flag) {
        query = query + " AND ";
      } else {
        query = query + " WHERE ";
      }

      query = query + "(";

      if (filter.getType() == FilterCategories.textSearch) {
        query = query + "Lower(description) LIKE Lower('%" + filter.getValue() + "%') OR Lower(title) LIKE Lower('%" + filter.getValue() + "%')"
      } else if (filter.getType() == FilterCategories.availability) {
        query = query + "Lower(availability) LIKE Lower('%" + filter.getValue() + "%')"
      } else if (filter.getType() == FilterCategories.city) {
        //SELECT * From service WHERE addressid IN (Select id From address Where city = 'Bern')
        query = query + "addressid IN (Select id From address Where city = $" + qCount + ")";
        qArray.push(filter.getValue());
        qCount++;
      } else if (filter.getType() == FilterCategories.capacity) {
        query = query + filter.getType() + " >= $" + qCount;
        qArray.push(filter.getValue());
        qCount++;
      } else if (filter.getType() == FilterCategories.price) {
        query = query + filter.getType() + " <= $" + qCount;
        qArray.push(filter.getValue());
        qCount++;
      }  else {
        query = query + filter.getType() + " = $" + qCount;

        qArray.push(filter.getValue());
        qCount++;
      }
      query = query + ")";
      flag = true;

    }

    console.log(query);

    const stream = client.query(query,qArray);

    const fileHandler = new FileHandlerService();

    for await (const row of stream) {
      const addressid = row.get('addressid');
      const address = await this.getAddressFromAId(Number(addressid), client);
      const serviceId = Number(row.get('id'));

      const imageString = fileHandler.getPictureFromServiceId(serviceId);




      let serviceBuilder = new EventServiceBuilder();



      container.addService(
        serviceBuilder.setServiceId(serviceId)
          .setProviderId(Number(row.get('userid')))
          .setCategory(String(row.get('category')))
          .setTitle(String(row.get('title')))
          .setDescription(String(row.get('description')))
          .setAddress(address)
          .setPerimeter(Number(row.get('radius')))
          .setAvailability(String(row.get('availability')))
          .setRequirments(String(row.get('requirements')))
          .setSubtype(String(row.get('subtype')))
          .setCapacity(Number(row.get('capacity')))
          .setPrice(Number(row.get('price')))
          .setImage(imageString)
          .build()
      );

    }
    return container;
  }

  private async deleteServiceFromDB (serviceId: number, client: Client) {
    const stream = client.query('SELECT addressid FROM service WHERE id=$1',[serviceId]);
    let oldAddressId = -1;
    for await (const row of stream){
      oldAddressId = Number(row.get('addressid'));

    }

    if (oldAddressId == -1) {
      throw Error("an error occured while getting the old address id of updated user")
    }

    await client.query('DELETE FROM service WHERE id = $1', [serviceId]);

    await this.searchForAddressUsageAndDelete(oldAddressId, client);
  }

  private async updateServiceDB (service: EventService, client: Client) {
    
  }






    //////////////////////////Testing//////////////////////////////////////////////////////////////////////////////////////

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


    // for testing only... returns all the users with given lastname
    async testSql(name: string, client: Client): Promise<SqlResult> {
        const sqlResult = new SqlResult();

        const stream = client.query('SELECT * From users Where email = $1', [name]);

        for await (const row of stream) {

            if (stream.rows == null) {
                throw new Error('no result found in database');
            }
            // tslint:disable-next-line:max-line-length
            const address = await this.getAddressFromAId(Number(row.get('addressid')), client);

            const user = new UserBuilder()
              .setId(Number(row.get('id')))
              .setFirstname(String(row.get('prename')))
              .setLastname(String(row.get('lastname')))
              .setEmail(String(row.get('email')))
              .setPwhash(String(row.get('password')))
              .setIsVerified(Boolean(row.get('isverified')))
              .setAddress(address)
              .setIsFirm(Boolean(row.get('isfirm')))
              .setPhonenumber(String(row.get('phonenumber')))
              .setFirmname(String(row.get('firmname')))
              .build();



            // tslint:disable-next-line:max-line-length
            sqlResult.addUser(user);
        }

      // tslint:disable-next-line:max-line-length

        return sqlResult;
    }




}



