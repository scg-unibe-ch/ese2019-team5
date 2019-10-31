import {Request, Response, Router} from "express";
import {Address} from "../models/address.model";
import {EventService} from "../models/eventService.model";

const router: Router = Router(); // part of express needed


/**
 * creates an Address and an EventService from the giben requestbody and adds it to the database
 */
router.post('/add', async(req: Request, res: Response) => {
    const address = new Address(req.body.street, req.body.housenumber, req.body.zip, req.body.city);
    const eventService = new EventService(req.body.providerId,req.body.category, req.body.title, req.body.description, req.body.availability, req.body.address, req.body.perimeter);
    try {
      //TODO db.service.addEventService(eventService) Cyrill

    } catch (error) {

    }
  }
)



router.get('/update')


export const EventServiceController: Router = router;
