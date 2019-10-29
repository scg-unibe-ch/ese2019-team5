import {Request, Response, Router} from "express";
import {User} from "../models/user.model";

const router: Router = Router(); // part of express needed

router.put('/update', async (req: Request, res: Response) => {
  try {
    const user = new User(req.body.firstname, req.body.lastname, req.body.email, req.body.pwhash, req.body.isVerified, req.body.address, false); //TODO stimmt das mit Frontend überein
    //db.Service.UpdateUser(user); //TODO hier user  machen und nach hinten schicken

  }
  catch (error) { //TODO welche error können auftreten?

  }
});

router.put( '/changepassword', async (req: Request, res: Response)=>{
  try { //TODO bekomme ich neues und altes Passwort nach hinten geschickt, sende sie an DB diese ändert sie und Löse noch eine Mail aus?

  }
  catch (error) {

  }
});


export const ProfileController: Router = router;
