import {Client, DatabaseError, ResultIterator} from 'ts-postgres';
import {User} from '../models/user.model';
import * as fs from 'fs';
import {LoginResult} from "../models/loginResult.model";
import {Address} from "../models/address.model";
import {EventService} from "../models/eventService.model";
import {EventServiceContainer} from "../models/eventServiceContainer.model";
import {EventServiceBuilder} from "../models/eventServiceBuilder.model";
import {DBServiceError} from "../errors/DBService.error";
import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {UserBuilder} from "../models/userBuilder.model";
import {FilterCategories} from "../models/filterCategories.enum";
import {ServiceRequest} from "../models/serviceRequest.model";
import {ServiceRequestBuilder} from "../models/serviceRequestBuilder.model";

const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync('./app/services/private.key', 'utf8');

export class DbServices {

  /**
   * returns an Client to connect to our database
   */
  private getClient(): Client {

    const config = {
      //'user': 'cyrill',
      'user' : 'postgres',
      //'host': '34.65.95.137',
      'host' : 'localhost',
      //'password': 'eseTeam5_2019!',
      'password' : 'root',
      'port': 5432,
      'database': 'eventdoo',
    };
    return new Client(config);
  }

  public async addEventService(service: EventService) {

    const localClient = this.getClient();
    await localClient.connect();

    try {
      const serviceId = await this.addServiceToDB(service, localClient);
    } finally {
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
    try {
      return await this.getUserFromDB(email, null, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async getUserFromId(id: number): Promise<User> {


    const localClient = this.getClient();
    await localClient.connect();
    try {
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
        return new LoginResult(user, this.generateJWT(email, user.getId()));
      } else {
        throw new DBServiceError("To login, please verify your email-address.", 931);
      }
    } else {
      throw new DBServiceError("Invalid email-address or password.", 934);
    }
  }

  /**
   * signs up an user in the db. Therefore it checks if the email already exists in the database. If not
   * then the method to enter the entry in the database is called
   * @param user as User object.
   */
  public async signUp(user: User): Promise<number> {
    const localClient = this.getClient();
    await localClient.connect();
    var id = -1;
    try {
      if (await this.checkIfMailIsUniqueDB(user.getEmail(), localClient)) {
        id = Number(await this.creatUserInDB(user, localClient));
        user.setId(id);
      } else {
        throw new DBServiceError("The email address you enterd is already used with an other account.", 926);
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
  public async makeUserVerified(email: string) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      const user = await this.getUserFromDB(email, null, localClient);
      await this.makeUserVerifiedDB(user, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async updateUser(user: User) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.updateUserDB(user, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async getAllServices(): Promise<EventServiceContainer> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getServiceFromDB([], localClient);
    } finally {
      await localClient.end();
    }
  }

  public async getServiceFilter(filter: EventServiceFilter[]): Promise<EventServiceContainer> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getServiceFromDB(filter, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async getServiceFromId(serviceId: number): Promise<EventServiceContainer> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getServiceFromDB([new EventServiceFilter(FilterCategories.serviceId, serviceId)], localClient);
    } finally {
      await localClient.end();
    }
  }

  public async deleteUser(userId: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.deleteUserFromDB(userId, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async deleteService(serviceId: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.deleteServiceFromDB(serviceId, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async resetPassword(email: string, newPW: string) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.resetPasswordDB(email, newPW, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async getFavoritesFromUid(userId: number): Promise<EventServiceContainer> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getFavorites(userId, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async addFavoriteToUser(userId: number, serviceId: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.addUserFavoirte(userId, serviceId, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async removeFavoriteFromUser(userId: number, serviceId: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.removeUserFavorite(userId, serviceId, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async updateServiceParams(serviceId: number, title: string, description: string, price: number, availability: string, radius: number, requirements: string, capacity: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.updateServiceDBParams(serviceId, title, description, price, availability, radius, requirements, capacity, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async addRequestedService (request: ServiceRequest) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.addRequestToDB(request, localClient);
    } finally {
      await localClient.end();
    }
  }

  public async getRequestsForUser (userId: number): Promise<ServiceRequest[]> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getRequestsFromUserDB(userId, localClient);
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
  private async makeUserVerifiedDB(user: User, client: Client) {
    await client.query('Update users Set isverified=true Where id = $1', [user.getId()])
  }

  /**
   * inserts a given user to the database
   * @param user as User Object
   * @param client to use to connect to the database
   */
  private async creatUserInDB(user: User, client: Client): Promise<number> {

    const addressId = Number(await this.checkIfAddressExistsAndCreate(user.getAddress().street, user.getAddress().housenumber, user.getAddress().zip, user.getAddress().city, client));
    const stream = client.query('Insert into users(prename, lastname, email, password, isverified, addressid, isfirm) Values ($1,$2,$3,$4,$5,$6,$7) Returning id As id', [
      user.getFirstname(),
      user.getLastname(),
      user.getEmail(),
      user.getPwHash(),
      user.getIsVerified(),
      addressId,
      user.getIsFirm()]);

    var id = -1;
    for await (const row of stream) {
      id = Number(row.get('id'));

    }
    if (id == -1) {
      throw new DBServiceError("There was an unknown  Error while saving your account in the database", 920);
    }

    return id;
  }

  private async updateUserDB(user: User, client: Client) {

    const addressId = Number(await this.checkIfAddressExistsAndCreate(user.getAddress().street, user.getAddress().housenumber, user.getAddress().zip, user.getAddress().city, client));

    const stream = client.query('SELECT addressid FROM users WHERE id=$1', [user.getId()]);
    let oldAddressId = -1;
    for await (const row of stream) {
      oldAddressId = Number(row.get('addressid'));

    }

    if (oldAddressId == -1) {
      throw new DBServiceError("There was an Error while updating your user.", 911);
    }

    await client.query('UPDATE users SET prename=$1, lastname=$2, addressid=$3, isfirm=$4, phonenumber=$5, firmname=$6 WHERE id=$7', [user.getFirstname(), user.getLastname(), addressId, user.getIsFirm(), user.getPhoneNumber(), user.getFirmname(), user.getId()]);

    this.searchForAddressUsageAndDelete(oldAddressId, client);

  }

  private async getUserFromDB(email: string | null, id: number | null, client: Client): Promise<User> {
    let user: User;
    let query: string;
    const qArray = [];

    if (id == null) {
      query = "SELECT * FROM users WHERE email = $1";
      qArray.push(email);
    } else {
      query = "SELECT * FROM users WHERE id = $1";
      qArray.push(id);
    }

    const stream = client.query(query, qArray);


    for await (const row of stream) {
      if (stream.rows == null) {
        throw new DBServiceError("No user with this email address found in the database.", 924);
      } else if (stream.rows.length !== 1) {
        throw new DBServiceError("This email address isnt unique.", 925);
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
          .setFavourite(await this.getFavoritesIdOfUser(Number(row.get('id')), client))
          .build();

        return user;
      }
    }
    throw new DBServiceError("No user with this email address found in the database.", 924);
  }

  private async getFavoritesIdOfUser(userId: number, client: Client): Promise<number[]> {
    const stream = client.query("SELECT serviceid FROM favorites WHERE userid = $1", [userId]);
    const serviceIdArray = [];

    for await (const row of stream) {
      serviceIdArray.push(Number(row.get('serviceid')));
    }

    return serviceIdArray;
  }

  private async deleteFavoritesOfUser(userId: number, client: Client) {
    await client.query("Delte From favorites Where userid = $1", [userId]);
  }

  private async deleteUserFromDB(userId: number, client: Client) {
    console.log("delete User dbService");
    const stream = client.query('SELECT addressid FROM users WHERE id=$1', [userId]);
    let oldAddressId = -1;
    for await (const row of stream) {
      oldAddressId = Number(row.get('addressid'));
    }

    if (oldAddressId == -1) {
      throw new DBServiceError("There was an Error while deleting your user.", 911);
    }

    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    const streamService = client.query('SELECT id FROM service WHERE userid = $1', [userId]);
    for await (const row of streamService) {
      this.deleteServiceFromDB(Number(row.get('id')), client);
    }

    await this.searchForAddressUsageAndDelete(oldAddressId, client);
    await this.deleteFavoritesOfUser(userId, client);
  }

  private async resetPasswordDB(email: string, newPW: string, client: Client) {
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [newPW, email]);
    console.log("passwort reset");
  }


  /**
   * takes an email address and checks if an user is allready using this address
   * @param email-address of new User
   */
  private async checkIfMailIsUniqueDB(email: string, client: Client): Promise<boolean> {
    const stream = client.query('SELECT email As email FROM users Where email = $1', [email]);
    var counter = 0;
    for await(const row of stream) {
      counter++;
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


  private async getAddressFromAId(addressId: number, client: Client): Promise<Address> {
    let address: Address;
    const stream = client.query('Select id, street, number, zip, city From address Where id = $1', [addressId]);
    for await(const row of stream) {
      if (stream.rows == null) {
        throw new Error('no address with this id found');
      } else {
        address = new Address(String(row.get('street')), Number(row.get('number')), Number(row.get('zip')), String(row.get('city')));
        address.setId(addressId);
        return address;
      }
    }
    throw new DBServiceError("No address with this id found.", 914);
  }

  private async checkIfAddressExistsAndCreate(street: string, number: number, zip: number, city: string, client: Client): Promise<Number> {
    var stream = client.query('Select id From address Where street = $1 And number = $2 And zip = $3 And city = $4', [street, number, zip, city]);

    for await (const row of stream) {
      return Number(row.get('id'));
    }

    stream = client.query('Insert into address(street, number, zip, city) Values ($1,$2,$3,$4) Returning id As id', [street, number, zip, city]);

    for await (const row of stream) {
      return Number(row.get('id'));
    }

    throw new DBServiceError("There was an Error while saving the address.", 912);
  }

  private async searchForAddressUsageAndDelete(addressId: number, client: Client) {
    const stream = await client.query('Select users.id FROM users WHERE addressid=$1 UNION SELECT service.id FROM service WHERE addressid=$1', [addressId]);
    if (stream.rows.length == 0) {
      await client.query('Delete From address Where id = $1', [addressId])
    }
  }


  private async addServiceToDB(service: EventService, client: Client): Promise<number> {

    const address = service.getAddress();

    const addressId = Number(await this.checkIfAddressExistsAndCreate(address.street, address.housenumber, address.zip, address.city, client));

    const stream = client.query('Insert into service(userid, category, title, description, addressid, radius, availability, requirements, subtype, capacity, price, image) Values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) Returning id', [
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
      service.getPrice(),
      service.getImage()
    ]);

    for await (const row of stream) {
      service.setServiceId(Number(row.get('id')));
      return Number(row.get('id'));
    }

    throw new DBServiceError("There was an unknown Error while creating your service. Please try again later.", 900);
  }


  private async getServiceFromDB(filterArray: EventServiceFilter[], client: Client): Promise<EventServiceContainer> {
    const container = new EventServiceContainer([]);

    let query = 'SELECT * FROM service';
    let qArray = [];
    let qCount = 1;

    let flag = false;
    for (const filter of filterArray) {
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
        query = query + "addressid IN (Select id From address Where Lower(city) LIKE Lower('%" + filter.getValue() + "%'))";
      } else if (filter.getType() == FilterCategories.capacity) {
        query = query + filter.getType() + " >= $" + qCount;
        qArray.push(filter.getValue());
        qCount++;
      } else if (filter.getType() == FilterCategories.price) {
        query = query + filter.getType() + " <= $" + qCount;
        qArray.push(filter.getValue());
        qCount++;
      } else if (filter.getType() == FilterCategories.subtype) {
        query = query + "Lower(subtype) LIKE Lower('%" + filter.getValue() + "%')"
      } else {
        query = query + filter.getType() + " = $" + qCount;

        qArray.push(filter.getValue());
        qCount++;
      }
      query = query + ")";
      flag = true;

    }

    console.log(query);
    console.log(qArray);

    const stream = client.query(query, qArray);

    //const fileHandler = new FileHandlerService();

    for await (const row of stream) {
      const addressid = row.get('addressid');
      const address = await this.getAddressFromAId(Number(addressid), client);
      //const address = new Address("abc",12,12,"abc");
      const serviceId = Number(row.get('id'));

      //const imageString = fileHandler.getPictureFromServiceId(serviceId);


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
          .setImage(String(row.get('image')))
          .build()
      );

    }
    container.reverse();
    return container;
  }

  private async deleteServiceFromDB(serviceId: number, client: Client) {
    const stream = client.query('SELECT addressid FROM service WHERE id=$1', [serviceId]);
    let oldAddressId = -1;
    for await (const row of stream) {
      oldAddressId = Number(row.get('addressid'));

    }

    if (oldAddressId == -1) {
      throw new DBServiceError("There was an Error while deleting your service.", 911);
    }

    await client.query('DELETE FROM service WHERE id = $1', [serviceId]);

    await this.searchForAddressUsageAndDelete(oldAddressId, client);
    await this.deleteServiceFromFavorites(serviceId, client);
  }

  private async deleteServiceFromFavorites(serviceId: number, client: Client) {
    await client.query('Delete From favorites Where serviceid = $1', [serviceId]);
  }

  private async getFavorites(userId: number, client: Client): Promise<EventServiceContainer> {
    const stream = client.query("SELECT * From service WHERE id IN (Select serviceid From favorites Where userid = $1)", [userId]);

    const container = new EventServiceContainer([]);

    for await (const row of stream) {
      const addressid = row.get('addressid');
      const address = await this.getAddressFromAId(Number(addressid), client);

      let serviceBuilder = new EventServiceBuilder();
      container.addService(
        serviceBuilder.setServiceId(Number(row.get('id')))
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
          .setImage(String(row.get('image')))
          .build()
      );
    }
    return container;
  }

  private async addUserFavoirte(userId: number, serviceId: number, client: Client) {
    await client.query('Insert Into service Values ($1, $2)', [userId, serviceId]);
  }

  private async removeUserFavorite(userId: number, serviceId: number, client: Client) {
    await client.query('Delete From favorites Where userid = $1 AND serviceid = $2', [userId, serviceId]);
  }

  private async updateServiceDBParams(serviceId: number, title: string, description: string, price: number, availability: string, radius: number, requirements: string, capacity: number, client: Client) {
    await client.query("Update service Set title=$1, description=$2, price=$3, availability=$4, radius=$5, requirements=$6, capacity=$7 Where id = $8", [
      title,
      description,
      price,
      availability,
      radius,
      requirements,
      capacity,
      serviceId]);
  }

  private async addRequestToDB(request: ServiceRequest, client: Client) {
    await client.query("Insert Into requests(clientid, serviceid, date, message) Values ($1,$2,$3,$4)", [
      request.getCustomerId(),
      request.getProviderId(),
      request.getDate(),
      request.getMessage()
    ]);
  }

  private async getRequestsFromUserDB (userId: number, client: Client): Promise<ServiceRequest[]> {
    const stream = client.query("Select * From requests Where clientid=$1",[userId]);
    const requestArray = [];
    for await (const row of stream) {
      const request = new ServiceRequestBuilder();

      request.setServiceId(Number(row.get('serviceid')));
      request.setDate(String(row.get('date')));
      request.setMessage(String(row.get('message')));

      const serviceStream = client.query("Select userid, category, title From service Where id = $1 ", [Number(row.get('serviceid'))]);
      const service = await serviceStream.first();

      if (service == undefined) {
        throw new DBServiceError("There is an request with an non existing service.",954);
      } else {
        request.setProviderId(Number(service.get('userid')));
        request.setCategory(String(service.get('category')));
        request.setServiceTitle(String(service.get('title')));
        requestArray.push(request.build());
      }
    }
    return requestArray;
  }


  //////////////////////////Testing//////////////////////////////////////////////////////////////////////////////////////


  // test function
  public async testAddress(street: string, number: number, zip: number, city: string): Promise<Number> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      const id = await this.checkIfAddressExistsAndCreate(street, number, zip, city, localClient);
      return id;
    } finally {
      await localClient.end();
    }
  }

  public async test(name: string) {
    const config = {
      'user': 'cyrill',
      'host': 'localhost',
      //'host' : 'localhost',
      'password': 'eseTeam5_2019!',
      'port': 5432,
      'database': 'eventdoo',
    };
    const client = new Client(config);

    await client.connect();

    console.log(client.closed);
    const stream = await client.query('SELECT * From users Where name = $1', [name]);
    console.log(stream);
  }


}



