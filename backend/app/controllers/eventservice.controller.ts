import {Request, Response, Router} from "express";
import {Address} from "../models/address.model";
import {EventService} from "../models/eventService.model";
import {EventServiceBuilder} from "../models/eventServiceBuilder.model";
import {DbServices} from "../services/db.services";
import {User} from "../models/user.model";
import {EmailOrderEventService} from "../services/emailOrderEventService.services";
import {EventServiceContainer} from "../models/eventServiceContainer.model";


const router: Router = Router(); // part of express needed
const dbService = new DbServices();

/**
 * listens to HTTP events Post with add
 * creates an Address and an EventService from the given requestbody and adds it to the database
 */
router.post('/add', async (req: Request, res: Response) => {
    console.log('got here');
    try {
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
        .setPerimeter(Number(req.body.perimeter))
        .build();
      if (req.body.subtype !== undefined) {
        eventService.setSubtype(req.body.subtype);
      }
      if (req.body.requirements !== undefined) {
        eventService.setRequirements(req.body.requirements);
      }
      if (req.body.image !== undefined) {
        console.log("image got to backend");
        let b64string = req.body.image;
        eventService.setImage(b64string);
      }
      console.log(req.body.capacity);

      await dbService.addEventService(eventService);

      console.log("ok");
      res.statusCode = 200;
      res.json('Service was created and saved')
    } catch (error) { //TODO welche error können auftreten? unkown error occurred while creating dB entry of the service
      console.log(error);
      res.send(error);
      res.statusCode = 400;


    }
  }
)


router.put('/update', async (req: Request, res: Response) => {
  // TODO woher wissen welchen Service es betrifft (nehme an Service id wird erhalten. auch die Frage erhalte ich alle Infos


});

/**
 *  listens to HTTP events Delete with userId and ServiceId given in URL
 * deletes a certain Service of a certain provider
 * returns 200 if Service was deleted
 * 406 if User or Service does not exist and 400 otherwise
 */
router.delete('/:serviceId', async (req: Request, res: Response) => {
    const serviceId: number = Number(req.params.serviceId);
    //onst serId:number= Number(req.query.serviceId);
    console.log("serviceId " + serviceId);
    //console.log( "serviceId query " +serId);
    try {
      await dbService.deleteService(serviceId)
      res.status(200).send('Service was deleted');
    } catch (error) {
      if (error.message.localeCompare('an error occured while getting the old address id of updated user') == 0) { //TODO abklären genau welcher error
        res.status(406).send('invalid ServiceId');
      } else {
        res.status(400).send('Service could not be deleted'); //TODO wie hier hin kommen
      }

    }
  }
)


router.get('/:serviceid', async (req: Request, res: Response) => {

  try {
     let serviceId: number = Number(req.params.serviceid);
      console.log('ServiceId'+ serviceId);
      let servicesContainer: EventServiceContainer = await dbService.getServiceFromId(serviceId);
      //console.log(servicesContainer);
      let eventServicesArray: EventService[] = servicesContainer.getServices();
      res.send(eventServicesArray.map(e => e.toSimplification()));
      res.status(200);
      //console.log(eventServicesArray.map(e => e.toSimplification()));
    } catch (error) {
      res.status(404);
      res.send('error in backend' + error.message);//TODO Cyrill weli gnau?
      console.log(error);
    }

  }
);


router.post('/order', async (req: Request, res: Response) => {
  try {
    let serviceId: number = req.body.serviceId;
    let customerId: number = req.body.customerId; //TODO wie definieret haben wollen?
    let message: string = req.body.message;
    let date: string = req.body.date; //TODO String version?
    let time: string = req.body.time;
    let orderedEventServiceContainer: EventServiceContainer = await dbService.getServiceFromId(serviceId);
    let orderedEventServiceArray: EventService[] = orderedEventServiceContainer.getServices();
    let orderedEventService: EventService = orderedEventServiceArray[0];
    let providerId = orderedEventService.getProviderId();
    let serviceTitle: string = orderedEventService.getTitle();
    const provider: User = await dbService.getUserFromId(providerId);
    let providerEmail = provider.getEmail();
    let providerName = provider.getFirstname()+ ' ' + provider.getLastname();
    const customer: User = await dbService.getUserFromId(customerId);
    let customerEmail: string = customer.getEmail();

    await EmailOrderEventService.sendMailToProvider(providerEmail, customerEmail, serviceTitle, date, time, message);
    await EmailOrderEventService.sendMailToCustomer(providerName, customerEmail, serviceTitle, date, time, message);
    res.status(200);
    res.json('The emails were sent ');


  } catch (error) {
    res.status(404);
    res.send(error + 'unknown email-address. Please check or sign up.');
    console.log(error);
  }


});


export const EventserviceController: Router = router;
