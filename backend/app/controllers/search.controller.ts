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

const router: Router = Router(); // part of express needed


// create new DBService
const dbService = new DbServices();




router.get('/', async (req: Request, res: Response) => {


    try {
      let allServicesContainer:EventServiceContainer=await dbService.getAllServices();
      let EventServicesArray: EventService []=allServicesContainer.getServices();
    res.send(EventServicesArray.map(e=>e.toSimplification()));
     // let allEventService={
      //  'allServicesContainer': allServicesContainer,
     // }
      res.status(200);
      //res.send(allEventService);

    } catch (error) {
      res.status(404);
      res.send('error in backend' + error.message);
      console.log(error);
    }

  }
);


router .get('/:filter',async (req: Request, res: Response) => {


  try {

  } catch (error) {
      res.status(404);
      res.send('error in backend' + error.message);
      console.log(error);
    }
  })


export const SearchController: Router = router;
