import {Request, Response, Router} from "express";
import {User} from "../models/user.model";
import {UserBuilder} from "../models/userBuilder.model";
import {Address} from "../models/address.model";
import {DbServices} from "../services/db.services";
import {EventServiceContainer} from "../models/eventServiceContainer.model";
import {FilterCategories} from "../models/filterCategories.enum";
import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {EventService} from "../models/eventService.model";
import {ServiceRequest} from "../models/serviceRequest.model";

const router: Router = Router();
const dbService = new DbServices();


/**
 * HTTP event listener to /update
 * creates a user and address adds phonenumber, firmname if given
 * sends the user to DB and answers with 200 if user could be saved
 * if there was an error with updating the user (400) will be sent
 * if there was an error while saving the address 404 will be sent
 * otherwise 409 will be sent
 */
router.post('/update', async (req: Request, res: Response) => { //TODO stimmt muss admin da hin
  try {
    let userOnlyPW: User = await dbService.getUserFromId(req.body.id);
    const pwHash = userOnlyPW.getPwHash();
    const housenumber = Number(req.body.housenumber);
    const zip = Number(req.body.zip);
    const address: Address = new Address(req.body.street, housenumber, zip, req.body.city);
    const user: User = UserBuilder.user()
      .setId(req.body.id)
      .setFirstname(req.body.firstname)
      .setLastname(req.body.lastname)
      .setEmail(req.body.email)
      .setPwhash(pwHash)
      .setIsVerified(true)
      .setAddress(address)
      .setIsFirm(req.body.isFirm)
      .build();


    if (req.body.phonenumber !== undefined) {
      user.setPhoneNumber(req.body.phonenumber);

    }
    if (req.body.firmname !== undefined) {
      user.setFirmname(req.body.firmname);
    }
    if (req.body.isAdmin !== undefined) {
      user.setIsAdmin(true);
    }

    await dbService.updateUser(user);

    res.json('Profile updated');
    res.statusCode = 200;

  } catch (error) { //TODO welche error können auftreten? error occured while getting the old id of updated user// address not found and error while inserting

    if(error.errorCode==912){
    console.log(error);
    res.send(error.message);
    res.statusCode = 404;}
    else if (error.errorCode== 911){
res.status(400).send(error.message);

    }else{
      res.status(409).send(error.message);
    }

  }
});

/**
 * HTTP event listener, listens to get /:id
 * gets an user profile form DB and all services, that this user has
 * and sends it to the front with 200 if everything went ok and 404 otherwise
 */
router.get('/:id', async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  let user: User;
  try {
    user = await dbService.getUserFromId(userId);
    //TODO hier user daten und EventServices anfragen wie EventServices von hinten erhalten als Array oder als viele container?  Cyrill
    const firstname: string = user.getFirstname();
    const lastname: string = user.getLastname();
    const email: string = user.getEmail();
    const pwHash: string = user.getPwHash();
    const address = user.getAddress();
    const street: string = address.street;
    const housenumber: number = address.housenumber;
    const zip: number = address.zip;
    const city: string = address.city;
    const isFirm: boolean = user.getIsFirm();
    const firmname: string = user.getFirmname();
    const phonenumber: string = user.getPhoneNumber();
    let userDataAndServices;
    let allServicesContainer: EventServiceContainer = await dbService.getServiceFilter([new EventServiceFilter(FilterCategories.user, userId)]);
    let eventServiceArrayOfUser: EventService[] = allServicesContainer.getServices();
    let size = eventServiceArrayOfUser.length;

    userDataAndServices = {
      'firstname': firstname,
      'lastname': lastname,
      'email': email,
      'pwHash': pwHash,
      'street': street,
      'housenumber': housenumber,
      'zip': zip,
      'city': city,
      'isFirm': isFirm,
      'firmname': firmname,
      'phonenumber': phonenumber,
      'eventServiceArrayOfUser': (eventServiceArrayOfUser.map(e => e.toSimplification())),
      'size': size
    };

    res.send(userDataAndServices);
    res.status(200);

  } catch (error) {

    //TODO welche error können auftreten?
    if(error.errorCode==914){
    res.send('Problem with service filter' + error.message);
    res.statusCode = 404;
  }else {
      res.status(404).send('Problem with getting user from id' + error.message);
    }
  }

});

// /**
//  * HTTP event listener, listens to get /changepassword
//  * //TODO gibts noch gar nit oder
//  */
// router.put('/changepassword', async (req: Request, res: Response) => {
//   try { //TODO bekomme ich neues und altes Passwort nach hinten geschickt, sende sie an DB diese ändert sie und Löse noch eine Mail aus?
//     const userId = Number(req.params.id);
//     let user: User = await dbService.getUserFromId(userId);
//
//     res.send('Password has changed');
//     res.statusCode = 202;
//   } catch (error) {
//     res.statusCode = 400;
//     res.send(error);
//   }
// });
/**
 * HTTP event listener, listens to delete /:userId
 * gives the database the userId so it gets deleted and
 * returns ok(200) if deletion worked and 400 otherwise
 */
router.delete('/:userId', async (req: Request, res: Response) => {
    try {
      let userId: number = Number(req.params.userId);
      await dbService.deleteUser(userId);
      res.status(200).json('User was deleted');

    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  }
);

/**
 * HTTP event listener, listens to put to /addFavourite
 * adds an event service to the user by letting the
 * DB know, sends ok (200) if favourite was added otherwise sends 400
 */
router.put('/addFavourite', async (req: Request, res: Response) => {
 try {

   const userId:number = parseInt(req.params.userId);
   const serviceId: number = parseInt(req.params.serviceId)
    await dbService.addFavoriteToUser(userId,serviceId); //TODO CYrill zum implementieren und Error Code anpassen
   res.status(200).send('added to favourites');
 }catch (error) {

   console.log(error.message + error.errorCode);
  res.status(400).send(error);
  // res.status(400);
 }
});

/**
 * HTTP event listener to get /favourite/:id
 * gets all the favourite event services of a user and sends
 * the array to the front
 * @returns ok (200) if everything went well otherwise 400
 */
router.get('/favourite/:id/:serviceid',async (req: Request, res: Response) => {
  try {
    let userId: number= parseInt(req.params.id);
    let favouriteContainer: EventServiceContainer = await dbService.getFavoritesFromUid(userId);
    let favouriteArrayOfUser: EventService[] =favouriteContainer.getServices();
    res.send(favouriteArrayOfUser.map(e => e.toSimplification()));

  }catch (error) {//TODO welche errors?
res.status(400).send(error.message);
  }});


router.get('/requestedServices/:customerId',async (req: Request, res: Response) => {
  try{
    let customerId: number= parseInt(req.params.customerId);
    let requestedServicesArray: ServiceRequest[]= await dbService.getRequestsForUser(customerId);
    res.status(200).send(requestedServicesArray.map(e => e.toSimplification()));

    }
catch (error) {
    res.status(404).send(error.message);
}

})

export const ProfileController: Router = router;
