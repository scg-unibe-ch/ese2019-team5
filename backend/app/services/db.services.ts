import {Client} from 'ts-postgres';
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
import jwt from 'jsonwebtoken';

const privateKey = fs.readFileSync('./app/services/private.key', 'utf8');

/**
 * This class is used to connect to the database.
 * There are the public methods which can be called and then there are the private methods. The public methods establish
 * and terminate the connection to the database and then pass this connection on to the private methods which then run
 * the query on the database and create the desired result.
 */
export class DbServices {

  /**
   * returns a Client to connect to the database.
   * By commenting out either one of the configs you can switch between the local database (if installed) and
   * the database hosted on Google Cloud services.
   * @returns an {@link Client} to connect to the database
   */
  private getClient(): Client {

    // When this config is active an local database is used.
    /*
    const config = {
      'user' : 'postgres',
      'host' : 'localhost',
      'password' : 'root',
      'port': 5432,
      'database': 'eventdoo',
    };*/

    // When this config is active (not commented out) then the database hosted on Google Cloud is used.

    const config = {
      'user': 'cyrill',
      'host': '34.65.95.137',
      'password': 'eseTeam5_2019!',
      'port': 5432,
      'database': 'eventdoo',
    };
    return new Client(config);
  }

  /**
   * Method to add an new {@link EventService} to the database
   * @async
   * @param service the {@link EventService} to add
   */
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
   * takes an eamil-address and retruns the {@link User} with this email from the database
   * @async
   * @param email of an user as {@link string}
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

  /**
   * Takes an userId and returns the {@link User} with this id
   * @async
   * @param id as {@link number}
   */
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
   * the {@link getUserFromEmail} method the corresponding user.
   * If the login credentials are correct, it returns an {@link LoginResult} object which contains the user as well as the JSON web token
   * @async
   * @param email of the user trying to log in
   * @param password, hashed password as string as received from the frontend
   */
  public async tryLogin(email: string, password: string): Promise<LoginResult> {
    let user: User;
    user = await this.getUserFromEmail(email);
    if (password == user.getPwHash()) {
      if (user.getIsVerified()) {
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
   * @async
   * @param user as {@link User} object.
   * @returns the id of the user as {@link number}
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
   * @async
   * @param email of the user that should get verified as {@link string}
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

  /**
   * This method updates an user. It takes an user Object where all the information is stored in and
   * overrides the information of this user in the database.
   * @async
   * @param user as {@link User}
   */
  public async updateUser(user: User) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.updateUserDB(user, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method returns all the EventServices from the database in an EventServiceContainer Object.
   * @async
   * @returns all EventServices in an {@link EventServiceContainer}
   */
  public async getAllServices(): Promise<EventServiceContainer> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getServiceFromDB([], localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method searches all the EventServices that fulfill the filter requirements and returns them as EventServiceContainer
   * @async
   * @param filter as {@link EventServiceFilter[]} in which all the filters are specified.
   * @returns the EventServices that correspond to the filters in an {@link EventServiceContainer}
   */
  public async getServiceFilter(filter: EventServiceFilter[]): Promise<EventServiceContainer> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getServiceFromDB(filter, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method returns the EventService with the given Id from the database in an EventServiceContainer.
   * @async
   * @param serviceId of the desired {@link EventService} as {@link number}.
   * @returns the EventService in an {@link EventServiceContainer}.
   */
  public async getServiceFromId(serviceId: number): Promise<EventServiceContainer> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getServiceFromDB([new EventServiceFilter(FilterCategories.serviceId, serviceId)], localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method deletes the user with the given id from the database.
   * @async
   * @param userId from the user to be deleted as {@link number}.
   */
  public async deleteUser(userId: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.deleteUserFromDB(userId, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method deletes the service with the given id from the database.
   * @async
   * @param serviceId from the service to be deleted as {@link number}.
   */
  public async deleteService(serviceId: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.deleteServiceFromDB(serviceId, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method overrides the password of an user with the given new password.
   * @async
   * @param email of the user which password should be overridden as {@link string}.
   * @param newPW the new password as {@link string}.
   */
  public async resetPassword(email: string, newPW: string) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.resetPasswordDB(email, newPW, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method returns all the EventServices the user added to his favorites in an EventServiceContainer.
   * @async
   * @param userId of which the favorites should be returned.
   * @returns the EventServices in an EventServiceContainer.
   */
  public async getFavoritesFromUid(userId: number): Promise<EventServiceContainer> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getFavorites(userId, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method adds an {@link EventService} to the favorites of the given user.
   * @async
   * @param userId of the user to which the {@link EventService} should be added as {@link number}.
   * @param serviceId of the EventService as {@link number}.
   */
  public async addFavoriteToUser(userId: number, serviceId: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.addUserFavoirte(userId, serviceId, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method removes an {@link EventService} from the favorites of an user.
   * @async
   * @param userId of the user as {@link number}.
   * @param serviceId of the service as {@link number}.
   */
  public async removeFavoriteFromUser(userId: number, serviceId: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.removeUserFavorite(userId, serviceId, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method updates an EventService in the database. It therefore takes all the Information of an EventService
   * that can be updated as parameters.
   * @async
   * @param serviceId as {@link number}
   * @param title as {@link string}
   * @param description as {@link string}
   * @param price as {@link number}
   * @param availability as {@link string}
   * @param radius as {@link number}
   * @param requirements as {@link string}
   * @param capacity as {@link number}
   */
  public async updateServiceParams(serviceId: number, title: string, description: string, price: number, availability: string, radius: number, requirements: string, capacity: number) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.updateServiceDBParams(serviceId, title, description, price, availability, radius, requirements, capacity, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * This method adds an ServiceRequest to the database.
   * @async
   * @param request as an {@link ServiceRequest}.
   */
  public async addRequestedService (request: ServiceRequest) {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      await this.addRequestToDB(request, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * Returns all the ServiceRequests of an user
   * @async
   * @param userId as {@link number}
   * @returns all the ServiceRequests as {@link ServiceRequest} array
   */
  public async getRequestsForUser (userId: number): Promise<ServiceRequest[]> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.getRequestsFromUserDB(userId, localClient);
    } finally {
      await localClient.end();
    }
  }

  /**
   * Checks if a user added a service as his favorites and returns true or false
   * @async
   * @param userId
   * @param serviceId
   * @returns true if service is favorite
   */
  public async isServiceFavorite(userId: number, serviceId: number): Promise<boolean> {
    const localClient = this.getClient();
    await localClient.connect();
    try {
      return await this.isServiceFavoriteOfUser(userId, serviceId, localClient);
    } finally {
      await localClient.end();
    }
  }

  /////////////////////       from here on down are the private helper methods that connect to the database       \\\\\\\\\\\\\\\\\\\\\\\\\\\


  /**
   * sets the isverified of an user in the database to true
   * @async
   * @param user as {@link User}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async makeUserVerifiedDB(user: User, client: Client) {
    await client.query('Update users Set isverified=true Where id = $1', [user.getId()])
  }

  /**
   * inserts a given user to the database
   * @async
   * @param user as {@link User}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns the id of the newly created user as{@link number}
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

  /**
   * This method overrides all the information of the given user in the database with the information stored in the
   * User Object
   * @async
   * @param user {@link User}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
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

  /**
   * This Method returns an {@link User} from the database.
   * It uses the {@link UserBuilder} to create an {@link User}
   * @async
   * @param email as {@link string} or null if the user should be searched by his id
   * @param id as {@link number} or null if the user should be searched by his email
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
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

  /**
   * This method returns all the EventServices the user marked as favorite.
   * @async
   * @param userId {@link number}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns an array with the ServiceIds of the as favorite marked Services
   */
  private async getFavoritesIdOfUser(userId: number, client: Client): Promise<number[]> {
    const stream = client.query("SELECT serviceid FROM favorites WHERE userid = $1", [userId]);
    const serviceIdArray = [];

    for await (const row of stream) {
      serviceIdArray.push(Number(row.get('serviceid')));
    }

    return serviceIdArray;
  }

  /**
   * This method deletes all the entries in the table favorites in the database where the userid is the given one.
   * @async
   * @param userId as {@link number}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async deleteFavoritesOfUser(userId: number, client: Client) {
    await client.query("Delte From favorites Where userid = $1", [userId]);
  }

  /**
   * This method deletes an user from the database.
   * First it gets the addressId of the user from the database. Then it deletes the user and all its services from the database.
   * Lastly it calls the {@link searchForAddressUsageAndDelete} method to delete the address if necessary, the
   * {@link deleteFavoritesOfUser} to delete all the favorites saved for this user and the {@link deleteUserFromRequests} to delete
   * all requests of this user..
   * @async
   * @param userId as {@link number}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async deleteUserFromDB(userId: number, client: Client) {
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
    await this.deleteUserFromRequests(userId, client);
  }

  /**
   * This method overrides the password for the user with the given email address.
   * @async
   * @param email of the user
   * @param newPW the new password that should be set.
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async resetPasswordDB(email: string, newPW: string, client: Client) {
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [newPW, email]);
  }


  /**
   * takes an email address and checks if an user is already using this email address
   * @async
   * @param email-address of new User
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns true if the Mail isn't used already
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
   * @returns the token as {@link string}
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
   * This method returns the address matching the given addressId from the database.
   * @async
   * @param addressId
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns the address as {@link Address} Object
   */
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

  /**
   * This method checks if the address is already stored in the database. If yes it returns the id of this address,
   * if no it creates the address in the database and returns it's id.
   * @async
   * @param street as {@link string}
   * @param number as {@link number}
   * @param zip as {@link number}
   * @param city as {@link string}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns the id of the address
   */
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

  /**
   * This method checks an address stored in the database is still used or not. If not it will be deleted.
   * @async
   * @param addressId
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async searchForAddressUsageAndDelete(addressId: number, client: Client) {
    const stream = await client.query('Select users.id FROM users WHERE addressid=$1 UNION SELECT service.id FROM service WHERE addressid=$1', [addressId]);
    if (stream.rows.length == 0) {
      await client.query('Delete From address Where id = $1', [addressId])
    }
  }


  /**
   * This method adds the given EventService to the database. It returns the id of the newly created service.
   * @async
   * @param service as {@link EventService}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns the id as {@link number} of the new EventService
   */
  private async addServiceToDB(service: EventService, client: Client): Promise<number> {

    const address = service.getAddress();

    const addressId = Number(await this.checkIfAddressExistsAndCreate(address.street, address.housenumber, address.zip, address.city, client));

    const stream = client.query('Insert into service(userid, category, title, description, addressid, radius, availability, requirements, subtype, capacity, price) Values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) Returning id', [
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

  /**
   * This method all EventServices that match the given filters in an EventServiceContainer.
   * First the sql query has to be built. Therefore it iterates through the given array of EventServiceFilters and adds them to the query corresponding to their type.
   * After the query is run on the database all the returned EventServices are built using the {@link EventServiceBuilder} and added to the EventServiceContainer.
   * @async
   * @param filterArray an array of {@link EventServiceFilter}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns an {@link EventServiceContainer} with the desired services.
   */
  private async getServiceFromDB(filterArray: EventServiceFilter[], client: Client): Promise<EventServiceContainer> {
    const container = new EventServiceContainer([]);

    let query = 'SELECT * FROM service';
    let qArray = [];
    let qCount = 1;

    let flag = false;
    // build the query
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

    const stream = client.query(query, qArray);


    // build and add the EventServices to the EventServiceContainer
    for await (const row of stream) {
      const addressid = row.get('addressid');
      const address = await this.getAddressFromAId(Number(addressid), client);
      const serviceId = Number(row.get('id'));

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

  /**
   * deletes the EventService from the database.
   * First the addressId of the EventService gets stored to later use the {@link searchForAddressUsageAndDelete} method.
   * Then the EventService gets deleted and then lastly the {@link deleteServiceFromFavorites} method is called to delete
   * the service from the favorites and requests table
   * @async
   * @param serviceId
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
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
    await this.deleteServiceFromRequests(serviceId, client);
  }

  /**
   * This method deletes all the entries of the favorites table where the serviceId is the given one.
   * @async
   * @param serviceId
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async deleteServiceFromFavorites(serviceId: number, client: Client) {
    await client.query('Delete From favorites Where serviceid = $1', [serviceId]);
  }

  /**
   * This method gets all the services the given users marked as favorite from the database and returns them in an EventServiceContainer
   * @async
   * @param userId
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns all the services in an EventServiceContainer
   */
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

  /**
   * This method adds an userId and serviceId pair to the database table favorite. This way a service can be added to
   * the users favorites.
   * First it checks if the user as well as the service really exist.
   * @async
   * @param userId
   * @param serviceId
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async addUserFavoirte(userId: number, serviceId: number, client: Client) {

    const service = await client.query("Select id From service Where id = $1",[serviceId]);
    if (service.rows.length == 0) {
      throw new DBServiceError("The service you wanted to add to your favorites doesn't exist.",952)
    }

    const user = await client.query("Select id From users Where id = $1",[userId]);
    if (user.rows.length == 0) {
      throw new DBServiceError("There seams to be a problem with your user-account please contact us.",952)
    }

    await client.query('Insert Into favorites Values ($1, $2)', [userId, serviceId]);
  }

  /**
   * This method removes an user Favorite (deletes an entry in the favorite table of the database).
   * @async
   * @param userId
   * @param serviceId
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async removeUserFavorite(userId: number, serviceId: number, client: Client) {
    await client.query('Delete From favorites Where userid = $1 AND serviceid = $2', [userId, serviceId]);
  }

  /**
   * This method updates an EventService in the database. It therefore overrides all the parameters that can be updated.
   * @async
   * @param serviceId as {@link number}
   * @param title as {@link string}
   * @param description as {@link string}
   * @param price as {@link number}
   * @param availability as {@link string}
   * @param radius as {@link number}
   * @param requirements as {@link string}
   * @param capacity as {@link number}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
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

  /**
   * This method adds an ServiceRequest to the database.
   * @async
   * @param request as {@link ServiceRequest}
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async addRequestToDB(request: ServiceRequest, client: Client) {
    await client.query("Insert Into requests(clientid, serviceid, date, message) Values ($1,$2,$3,$4)", [
      request.getCustomerId(),
      request.getServiceId(),
      request.getDate(),
      request.getMessage()
    ]);
  }

  /**
   * This method returns all the ServiceRequests of an user in an array.
   * @async
   * @param userId of the user which requests should be returned
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns all the ServiceRequests of this user in an array
   */
  private async getRequestsFromUserDB (userId: number, client: Client): Promise<ServiceRequest[]> {
    const stream = client.query("Select * From requests Where clientid=$1",[userId]);
    const requestArray = [];
    for await (const row of stream) {
      const request = new ServiceRequestBuilder();

      request.setServiceId(Number(row.get('serviceid')));
      request.setDate(String(row.get('date')));
      request.setMessage(String(row.get('message')));

      const serviceStream = await client.query("Select userid, category, title From service Where id = $1 ", [Number(row.get('serviceid'))]);
      const service = serviceStream.rows[0];

      if (service == null) {
        throw new DBServiceError("There is an request with an non existing service.",954);
      } else {
        request.setProviderId(Number(service[0]));
        request.setCategory(String(service[1]));
        request.setServiceTitle(String(service[2]));
        requestArray.push(request.build());
      }
    }
    return requestArray;
  }

  /**
   * This method removes an Service from the requests table in the database.
   * @async
   * @param serviceId of the service you wan't to delete.
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async deleteServiceFromRequests (serviceId: number, client: Client) {
    await client.query("Delete From requests Where serviceId = $1", [serviceId]);
  }

  /**
   * This method removes an user from the requests table in the database.
   * @async
   * @param userId of the user you wan't to delete.
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   */
  private async deleteUserFromRequests (userId: number, client: Client) {
    await client.query("Delete From requests Where clientId = $1", [userId]);
  }

  /**
   * This method checks if an user added a service to his favorites and returns true or false.
   * @async
   * @param userId
   * @param serviceId
   * @param client to use to connect to the database. The has to be already established and closed is to be closed in the calling method
   * @returns true if the user added the service to his favorites otherwise false.
   */
  private async isServiceFavoriteOfUser (userId: number, serviceId: number, client: Client): Promise<boolean> {
    const stream = await client.query("Select EXISTS (Select * From favorites Where userid = $1 AND serviceid = $2)", [userId, serviceId]);
    return Boolean(stream.rows[0][0]);
  }
}



