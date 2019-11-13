import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';
import {Address} from "../models/address.model";
import {EmailVerificationServices} from '../services/emailVerification.services';
import {DbServices} from '../services/db.services';

var jwt = require('jsonwebtoken');
import * as fs from 'fs';
import {UserBuilder} from "../models/userBuilder.model";
import {EventServiceContainer} from "../models/eventServiceContainer.model";
import {EventService} from "../models/eventService.model";
import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {FilterCategories} from "../models/filterCategories.enum";

const router: Router = Router(); // part of express needed


// create new DBService
const dbService = new DbServices();


router.get('/', async (req: Request, res: Response) => {


    try {
      let allServicesContainer: EventServiceContainer = await dbService.getAllServices();
      let EventServicesArray: EventService [] = allServicesContainer.getServices();
      res.send(EventServicesArray.map(e => e.toSimplification()));
      // let allEventService={
      //  'allServicesContainer': allServicesContainer,
      // }
      res.status(200);
      //res.send(allEventService);
 console.log('not really where you want to be');
    } catch (error) {
      res.status(404);
      res.send('error in backend' + error.message);
      console.log(error);
    }

  }
);


router.get('/filter/:category/:city?/:price?', async (req: Request, res: Response) => {
  try {
    let category: string = req.query.category;
    let city: string = req.query.city
    console.log('got here');
    console.log(city);

    console.log(category);
    let serviceCFittingRequest: EventServiceContainer = await dbService.getServiceFilter([new EventServiceFilter(FilterCategories.category, category)]);
    let serviceAOfFittingRequest: EventService[] = serviceCFittingRequest.getServices();
    res.status(200).send(serviceAOfFittingRequest.map(e => e.toSimplification()))

    console.log(serviceAOfFittingRequest);
  } catch (error) {
    res.status(404);
    res.send('error in backend' + error.message);
    console.log(error);
  }
})


export const SearchController: Router = router;
