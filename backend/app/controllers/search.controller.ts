import {Request, Response, Router} from 'express';
import {DbServices} from '../services/db.services';
import {EventServiceContainer} from "../models/eventServiceContainer.model";
import {EventService} from "../models/eventService.model";
import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {FilterCategories} from "../models/filterCategories.enum";

var jwt = require('jsonwebtoken');

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

    } catch (error) {
      res.status(404);
      res.send('error in backend' + error.message);
      console.log(error);
    }

  }
);


router.get('/filter/:text?/:category?/:subtype?/:city?/:price?/:people?/:availability?', async (req: Request, res: Response) => {
  try {
  // let textSearch:string= req.query.textSearch;
    let textSearch= req.query.text;
    let category: string = req.query.category;
    let subtype:string= req.query.subtype;
    let city: string = req.query.city;
    let price:Number= req.query.price;
    let people:Number= req.query.people;
    let availability:string= req.query.availability;
    console.log('got here');
    console.log('textSearch'+ textSearch);


    let EventServiceFilterArray:EventServiceFilter[]= [];
    if( textSearch!==undefined){
      EventServiceFilterArray.push(new EventServiceFilter(FilterCategories.textSerach, textSearch))
    }
    if( category!==undefined){
      EventServiceFilterArray.push(new EventServiceFilter(FilterCategories.category, category))
    }
    if( subtype!==undefined){
      EventServiceFilterArray.push(new EventServiceFilter(FilterCategories.subtype, subtype))
    }
    if( city!==undefined){
      EventServiceFilterArray.push(new EventServiceFilter(FilterCategories.city, city))
    }

console.log(EventServiceFilterArray);
 let serviceCFittingRequest: EventServiceContainer = await dbService.getServiceFilter(EventServiceFilterArray);
 console.log('ServiceCFittingREquest'+ serviceCFittingRequest);
   let serviceAOfFittingRequest: EventService[] = serviceCFittingRequest.getServices();
    res.status(200).send(serviceAOfFittingRequest.map(e => e.toSimplification()))

   console.log(serviceAOfFittingRequest);
  } catch (error) {
    res.status(404);
    res.send('error in backend ' + error.message);
    console.log(error);

  }
})


export const SearchController: Router = router;
