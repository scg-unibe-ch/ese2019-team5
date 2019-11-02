import {Request, Response, Router} from "express";
import {User} from "../models/user.model";
import {UserBuilder} from "../models/userBuilder.model";
import {Address} from "../models/address.model";

const router: Router = Router(); // part of express needed


router.put('/', async (req: Request, res: Response) => {
  try {
    let id: number= req.body.id;
    let user: User;
    //user=db.Service.GetUserFromId(id); //TODO hier user daten und services anfragen wie EventServices von hinten erhalten als Array oder als viele Einzelne Events?  Cyrill
    //All eventServices=db. Service.GetAllEvents(id);

    //Version nicht alles einzeln
    /*const userDataAndServices= {
      'user': user,
      'EventServicesList': eventServiceList

    }*/

    //Version alles einzeln
/*   const firstname: string= user.firstname;
    const lastname: string= user.lastname;
    const email: string= user.email;
    const address= user.address;
    const isFirm: boolean= user.isFirm;
   const userDataAndServices= {
    'firstname': firstname,
     'lastname': lastname,
     'email': email,
     'address': address,
    'isFirm': isFirm,
     //TODO Services Fehlen! noch warten weil erst von DB erhalten

    }*/
    //res.send(userDataAndServices);
    res.statusCode = 200;
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
      .setIsVerified(req.body.isVerified)
      .setAddress(address)
      .setIsFirm(false)
      .build();
   // const user = new User(req.body.firstname, req.body.lastname, req.body.email, req.body.pwhash, req.body.isVerified, req.body.address, false); //TODO stimmt das mit Frontend überein
    //db.Service.UpdateUser(user); //TODO hier user  machen und nach hinten schicken Cyrill

    res.send('Profile updated');
    res.statusCode = 200;
  }
  catch (error) { //TODO welche error können auftreten?
  res.send(error);
  res.statusCode= 400;
  }
});



router.put( '/changepassword', async (req: Request, res: Response)=>{
  try { //TODO bekomme ich neues und altes Passwort nach hinten geschickt, sende sie an DB diese ändert sie und Löse noch eine Mail aus?

  }
  catch (error) {

  }
});


export const ProfileController: Router = router;
