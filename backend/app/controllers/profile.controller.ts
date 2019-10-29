import {Request, Response, Router} from "express";

const router: Router = Router(); // part of express needed

router.put('/update', async (req: Request, res: Response) => {
  try {
    //db.Service.UpdateUser(user); //TODO hier user oder nur das was sich ändert und was muss genau überprüft werden....

  }
  catch (error) {

  }
});

router.put( '/changepassword', async (req: Request, res: Response)=>{
  try {

  }
  catch (error) {

  }
});


export const ProfileController: Router = router;
