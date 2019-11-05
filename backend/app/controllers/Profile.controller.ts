import {Request, Response, Router} from "express";
import {User} from "../models/user.model";
import {UserBuilder} from "../models/userBuilder.model";
import {Address} from "../models/address.model";
import {DbServices} from "../services/db.services";

const router: Router = Router(); // part of express needed
const dbService = new DbServices();


router.get('/:id', async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  let user: User;
  console.log(userId);

  try {
    user = await dbService.getUserFromId(userId);
    res.statusCode = 200;
    res.send(user.toJSONObject());

    // let user: User=db.Service.GetUserFromId(id); //TODO hier user daten und services anfragen wie EventServices von hinten erhalten als Array oder als viele Einzelne Events?  Cyrill
    //All let eventServices: EventService []=db. Service.GetAllEvents(id);

    //Version nicht alles einzeln
    /*const userDataAndServices= {
      'user': user,
      'EventServicesList': eventServiceList

    }*/

    //Version alles einzeln
/*   const firstname: string= user.getFirstname();
    const lastname: string= user.getLastname();
    const email: string= user.getEmail();
    const address= user.getAddress();
    const isFirm: boolean= user.getIsFirm();
   const userDataAndServices= {
    'firstname': firstname,
     'lastname': lastname,
     'email': email,
     'address': address,
    'isFirm': isFirm,
     //TODO Services Fehlen! noch warten weil erst von DB erhalten

    }*/
    //res.send(userDataAndServices);

    /** Habe hier json form gewählt die im Frontend erwartet wird. Userobjekt senden hat nicht funktioniert.
     * Genau definiert ist die userJson form im Interface userJson (unter start/userprofile/userJson.js)
     * Gedacht als Notiz für Gillian
     */
    /*
    const dummyUser ={firstname:'Dummy', lastname:'McDummson', email:'dummy@dumdum.com', street: 'Streetystreet', housenumber:'8', zip: '4000', city:'Dumbcity'};
    //const userAsJson = user.toJSONObject();
    res.send(dummyUser);

    res.statusCode = 200;*/
  }
  catch (error) { //TODO welche error können auftreten?
    res.send(error);
    res.statusCode= 400;
  }

});

router.put('/update', async (req: Request, res: Response) => {
  try {
    const address:Address= new Address(req.body.street, req.body.housenumber, req.body.zip,req.body.city);
    const user: User = UserBuilder.user()
      .setFirstname(req.body.firstname)
      .setLastname(req.body.lastname)
      .setEmail(req.body.email)
      .setPwhash(req.body.pwhash)
      .setIsVerified(true)
      .setAddress(address)
      .setIsFirm(req.body.isFirm)
      .build();

    if (req.body.phoneNumber!=null){
      user.setPhoneNumber(req.body.phoneNumber);
    }
    if (req.body.firmname!=null){
      user.setFirmname(req.body.firmname);
    }

    await dbService.updateUser(user);

    res.send('Profile updated');
    res.statusCode = 200;
  }
  catch (error) { //TODO welche error können auftreten?
    console.log(error);
    res.send(error);
    res.statusCode= 400;
  }
});



router.put( '/changepassword', async (req: Request, res: Response)=>{
  try { //TODO bekomme ich neues und altes Passwort nach hinten geschickt, sende sie an DB diese ändert sie und Löse noch eine Mail aus?
   // let user: User=db.Service.GetUserFromId(id);

    res.send('Password has changed');
    res.statusCode=202;
  }
  catch (error) {
res.statusCode=400;
res.send(error);
  }
});


export const ProfileController: Router = router;
