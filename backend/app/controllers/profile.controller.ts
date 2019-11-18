import {Request, Response, Router} from "express";
import {User} from "../models/user.model";
import {UserBuilder} from "../models/userBuilder.model";
import {Address} from "../models/address.model";
import {DbServices} from "../services/db.services";
import {elementAt} from "rxjs/operators";
import {EventServiceContainer} from "../models/eventServiceContainer.model";
import {FilterCategories} from "../models/filterCategories.enum";
import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {EventService} from "../models/eventService.model";

const router: Router = Router(); // part of express needed
const dbService = new DbServices();

router.post('/update', async (req: Request, res: Response) => {
  try {

    console.log(req.body.id);
    console.log('body' + req.body);
    console.log("email" + req.body.email);
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
    console.log(error);
    res.send(error);
    res.statusCode = 400;

  }
});


router.get('/:id', async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  console.log(userId);
  let user: User;
  try {
    user = await dbService.getUserFromId(userId);
    //  res.send(user.toJSONObject());

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
    let size= eventServiceArrayOfUser.length;

    //   (EventServiceArrayOfUser.map(e=>e.toSimplification()));

    console.log(address);

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
      'size':size
    };
    console.log(eventServiceArrayOfUser.map(e => e.toSimplification()));
    console.log(userDataAndServices);


    res.send(userDataAndServices);
    res.status(200);
  } catch (error) { //TODO welche error können auftreten?
    res.send(error);
    res.statusCode = 400;
  }

});


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

router.delete('/:userId', async (req: Request, res: Response) => {
    try {
      let userId: number = Number(req.params.userId);
      await dbService.deleteUser(userId);
      res.status(200).send('User was deleted');

    } catch (error) {
      res.statusCode = 400;//TODO welche Error?
      res.send(error);
    }
  }
)


export const ProfileController: Router = router;
