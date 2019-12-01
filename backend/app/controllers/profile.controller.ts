import {Request, Response, Router} from "express";
import {User} from "../models/user.model";
import {UserBuilder} from "../models/userBuilder.model";
import {Address} from "../models/address.model";
import {DbServices} from "../services/db.services";
import {EventServiceContainer} from "../models/eventServiceContainer.model";
import {FilterCategories} from "../models/filterCategories.enum";
import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {EventService} from "../models/eventService.model";

const router: Router = Router();
const dbService = new DbServices();


/**
 * HTTP event listener to /update
 * creates a user and address adds phonenumber, firmname if given
 * sends the user to DB and answers with 200 if user could be saved
 * otherwise answer is 400
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

    if(error.errorCode==914){
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
 * and sends it to the front with 200 if everything went ok and 400 otherwise
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

/**
 * HTTP event listener, listens to get /changepassword
 * //TODO gibts noch gar nit oder
 */
router.put('/changepassword', async (req: Request, res: Response) => {
  try { //TODO bekomme ich neues und altes Passwort nach hinten geschickt, sende sie an DB diese ändert sie und Löse noch eine Mail aus?
    const userId = Number(req.params.id);
    let user: User = await dbService.getUserFromId(userId);

    res.send('Password has changed');
    res.statusCode = 202;
  } catch (error) {
    res.statusCode = 400;
    res.send(error);
  }
});
/**
 * HTTP event listener, listens to delete /:userId
 * gives the database the userId so it gets deleted and
 * returns ok if deletion worked and 400 otherwise
 */
router.delete('/:userId', async (req: Request, res: Response) => {
    try {
      let userId: number = Number(req.params.userId);
      await dbService.deleteUser(userId);
      res.status(200).json('User was deleted');

    } catch (error) {
      res.statusCode = 400;//TODO welche Error?
      res.send(error.message);
    }
  }
);


router.put('/addFavorite', async (req: Request, res: Response) => {
 try {

   const userId:number = parseInt(req.params.userId);
   const serviceId: number = parseInt(req.params.serviceId)
   // await dbService.addFavorite(userId,serviceId); //TODO CYrill zum implementieren und Error Code anpassen
   res.status(200).send('added to favorites');
 }catch (error) {

   console.log(error.message + error.errorCode);
  // res.status(400).send(error);
   res.status(400);


 }

});


export const ProfileController: Router = router;
