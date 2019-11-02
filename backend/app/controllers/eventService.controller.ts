import {Request, Response, Router} from "express";
import {Address} from "../models/address.model";
import {EventService} from "../models/eventService.model";
import {EventServiceBuilder} from "../models/eventServiceBuilder.model";

const router: Router = Router(); // part of express needed


/**
 * creates an Address and an EventService from the giben requestbody and adds it to the database
 */
router.post('/add/', async(req: Request, res: Response) => {
    const address = new Address(req.body.street, req.body.housenumber, req.body.zip, req.body.city);
    const eventService: EventService = EventServiceBuilder.eventService()
      .setProviderId(req.body.providerId)
      .setCategory(req.body.category)
      .setTitle( req.body.title)
      .setDescription(req.body.description)
      .setAvailability(req.body.availabilit)
      .setAddress(req.body.address)
      .setPerimeter(req.body.perimeter)
      .build();
    try {
      //TODO db.service.addEventService(eventService) Cyrill

    } catch (error) {

    }
  }
)



router.get('/update')


export const EventServiceController: Router = router;
