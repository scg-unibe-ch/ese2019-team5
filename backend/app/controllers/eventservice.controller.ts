import {Request, Response, Router} from "express";
import {Address} from "../models/address.model";
import {EventService} from "../models/eventService.model";
import {EventServiceBuilder} from "../models/eventServiceBuilder.model";
import {DbServices} from "../services/db.services";
import {User} from "../models/user.model";
import {EmailOrderEventService} from "../services/emailOrderEventService.services";
import {EventServiceContainer} from "../models/eventServiceContainer.model";
import {EmailReportServiceServices} from "../services/emailReportService.services";
import {parseConnectionUrl} from "nodemailer/lib/shared";


const router: Router = Router(); // part of express needed
const dbService = new DbServices();

/**
 * listens to HTTP events Post with add
 * creates an Address and an EventService from the given requestbody and adds it to the database
 * depending on whether there is a subtype, requirments or image it gets added.
 * answers with 201 if service got created and saved otherwise with 400
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
      //console.log("image got to backend");
        let b64string = req.body.image;
        eventService.setImage(b64string);
      }
     // console.log(req.body.capacity);

      await dbService.addEventService(eventService);

      //console.log("ok");
      res.statusCode = 201;
      res.json('Service was created and saved')
    } catch (error) { //TODO welche error können auftreten? unkown error occurred while creating dB entry of the service
      console.log(error);

      res.send(error);
      res.statusCode = 400;


    }
  }
)


router.put('/update', async (req: Request, res: Response) => {

 try {
   let title: string = req.body.title;
   let description: string = req.body.description;
   let availability: string = req.body.availability;
   let requirements: string = req.body.requirements;
   let capacity: number = parseInt(req.body.capacity);
   let price: number = parseInt(req.body.price);
   let serviceId: number = parseInt(req.body.serviceId);
///TODO implementieren von Cyrill und welche Error
   // await dbService.updateEventservice(serviceId, title, description,availability,requirements, capacity,price);
   res.status(202).send('service updated');

 }catch (error) {
   res.status(404).status(error);

 }


});

/**
 *  listens to HTTP events Delete with serviceId given in URL
 * deletes a certain Service of a certain provider
 * returns 200 if Service was deleted
 * 406 if User or Service does not exist and 400 otherwise
 */
router.delete('/:serviceId', async (req: Request, res: Response) => {
    const serviceId: number = Number(req.params.serviceId);

    console.log("serviceId " + serviceId);

    try {
      await dbService.deleteService(serviceId)
      res.status(200).send('Service was deleted');
    } catch (error) {
      res.status(406).send(error.message);
/*      if (error.message.localeCompare('an error occured while getting the old address id of updated user') == 0) { //TODO abklären genau welcher error
        res.status(406).send('invalid ServiceId');
      } else {
        res.status(400).send('Service could not be deleted'); //TODO wie hier hin kommen
      }*/

    }
  }
)

/**
 *   listens to HTTP events get with serviceId given in URL
 *   receives a services container form the DB
 *   extracts the array and sens the first event simplified to the front
 *   answers with 200 if ok otherwise with 404
 */
router.get('/:serviceid', async (req: Request, res: Response) => {

  try {
     let serviceId: number = Number(req.params.serviceid);
      let servicesContainer: EventServiceContainer = await dbService.getServiceFromId(serviceId);
      let eventServicesArray: EventService[] = servicesContainer.getServices();
      res.send(eventServicesArray[0].toSimplification());
      res.status(200);
    } catch (error) {
      res.status(404);
      res.send('error in backend' + error.message);
      console.log(error);
    }

  }
);

/**
 * HTTP event listener to post /order if an event gets ordered
 * triggers off 2 emails to the client and the service provider
 * answers with 200 if ok and 404 otherwise
 */
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
/**
 * HTTP event listener to post /report
 * gets triggered when a customer thinks a service is inappropriate and
 * therefor triggers here an email that is sent to the Eventdoo team to have a lok at
 * 200 if email could be sent ok, 400 otherwise
 */
router.post('/report', async (req: Request, res: Response) => {
  let serviceId= req.body.serviceId;
  let userId= req.body.userId;
 try {

    EmailReportServiceServices.sendReportMail(serviceId, userId);
    res.statusCode = 200;
    res.json('service got reported to email');

  } catch (error) {
    console.log(error.message);
    res.statusCode = 400;
    res.send(error);
}
});


export const EventserviceController: Router = router;
