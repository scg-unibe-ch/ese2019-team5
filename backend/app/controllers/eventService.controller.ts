import {Request, Response, Router} from "express";
import {Address} from "../models/address.model";
const router: Router = Router(); // part of express needed

//TODO davon ausgehend dass ich EventService kreeire

router.post('/add', async(req: Request, res: Response) => {
  const address = new Address(req.body.street,req.body.housenumber, req.body.zip, req.body.city);
 // const eventService = new EventService(req.body.category,req.body.title,address,req.body.perimeter, req.body.description, req.body.weekdays)

  }
)



router.get('/update')


export const EventServiceController: Router = router;
