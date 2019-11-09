import {Request, Response, Router} from "express";
import {Address} from "../models/address.model";
import {EventService} from "../models/eventService.model";
import {EventServiceBuilder} from "../models/eventServiceBuilder.model";
import {DbServices} from "../services/db.services";
import {User} from "../models/user.model";

const router: Router = Router(); // part of express needed
const dbService = new DbServices();

/**
 * creates an Address and an EventService from the given requestbody and adds it to the database
 */
router.post('/add', async (req: Request, res: Response) => {

    const address = new Address(req.body.street, req.body.housenumber, req.body.zip, req.body.city);
    const eventService: EventService = EventServiceBuilder.eventService()
      .setProviderId(req.body.providerId)
      .setCategory(req.body.category)
      .setTitle(req.body.title)
      .setDescription(req.body.description)
      .setAvailability(req.body.availability)
      .setCapacity(req.body.capacity)
      .setPrice(req.body.price)
      .setAddress(address)
      .setPerimeter(req.body.perimeter)
      .build();
    if (req.body.subtype !== undefined) {
      eventService.setSubtype(req.body.subtype);
    }
    if (req.body.requirements !== undefined) {
      eventService.setRequirements(req.body.requirements);
    }
    try {

      dbService.addEventService(eventService);

      res.statusCode = 200;
      res.send('Service was created and saved')
    } catch (error) { //TODO welche error können auftreten? unkown error occurred while creating dB entry of the service
      res.send(error);
      res.statusCode = 400;


    }
  }
)



router.get('/update', async (req: Request, res: Response) => {
  // TODO woher wissen welchen Service es betrifft (nehme an Service id wird erhalten. auch die Frage erhalte ich alle Infos


})

router.delete('/:serviceid/:providerid', async (req: Request, res: Response) => {
  const userId = Number(req.query.providerid);
  console.log(userId);
  const serviceId = Number(req.params.serviceid);
  console.log(serviceId);
  let user: User;
  let eventService: EventService;
  try{
  user = await dbService.getUserFromId(userId);

    //dbService.deleteEventService(userId,serviceId) TODO für Cyrill zum implementieren
    res.status(200).send('Service was deleted');
    }catch (error) {
    if(error.message.localeCompare('User does not exists')==0){ //TODO abklären genau welcher error
      res.status(406).send('invalid UserId');
    }
    else if(error.message.localeCompare('Service does not exists')==0){ //TODO abklären genau welcher error
      res.status(406).send('invalid ServiceId');
    }
    else {
      res.status(400).send('Service could not be deleted');
    }

  }
  }
)


export const EventserviceController: Router = router;
