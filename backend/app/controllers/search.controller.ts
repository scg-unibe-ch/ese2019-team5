/**
 * This controller is used in connection with everything that has to do with search
 * including searching for all the events or just a couple of them
 */

import {Request, Response, Router} from 'express';
import {DbServices} from '../services/db.services';
import {EventServiceContainer} from "../models/eventServiceContainer.model";
import {EventService} from "../models/eventService.model";
import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {FilterCategories} from "../models/filterCategories.enum";


const router: Router = Router();
const dbService = new DbServices();

/**
 * HTTP event listener to get /search
 * retrieves the services from the backend and sends it to the frontend
 * @return 200 (ok) if everything went well otherwise 404 (not found)
 */
router.get('/', async (req: Request, res: Response) => {


    try {
      let allServicesContainer: EventServiceContainer = await dbService.getAllServices();
      let EventServicesArray: EventService [] = allServicesContainer.getServices();
      res.send(EventServicesArray.map(e => e.toSimplification()));
      res.status(200);
    } catch (error) {
      res.status(404);
      res.send('error in backend  at getAllServices' + error.message);
      console.log(error);
    }

  }
);

/**
 * HTTP event listener to /filter/all possible filters
 * asks DB with a EventServiceFilter Array containing all the used parameters
 * @return 200 (ok) and the results from the db or 404 (not found)
 */
router.get('/filter/:text?/:category?/:subtype?/:city?/:price?/:people?/:availability?', async (req: Request, res: Response) => {
  try {
    let textSearch = req.query.text;
    let category: string = req.query.category;
    let subtype: string = req.query.subtype;
    let city: string = req.query.city;
    let price: number = req.query.price;
    let capacity: number = req.query.people;
    let availability: string = req.query.availability;
    let eventServiceFilterArray: EventServiceFilter[] = [];
    if (textSearch !== undefined) {
      eventServiceFilterArray.push(new EventServiceFilter(FilterCategories.textSearch, textSearch))
    }
    if (category !== undefined) {
      eventServiceFilterArray.push(new EventServiceFilter(FilterCategories.category, category))
    }
    if (subtype !== undefined) {
      eventServiceFilterArray.push(new EventServiceFilter(FilterCategories.subtype, subtype))
    }
    if (city !== undefined) {
      eventServiceFilterArray.push(new EventServiceFilter(FilterCategories.city, city))
    }
    if (price !== undefined && !isNaN(price) ) {
      eventServiceFilterArray.push(new EventServiceFilter(FilterCategories.price, price))
    }
    if (capacity !== undefined) {
      eventServiceFilterArray.push(new EventServiceFilter(FilterCategories.capacity, capacity))
    }
    if (availability !== undefined) {
      eventServiceFilterArray.push(new EventServiceFilter(FilterCategories.availability, availability))
    }
    let servicesFittingRequest: EventServiceContainer = await dbService.getServiceFilter(eventServiceFilterArray);

    let serviceAOfFittingRequest: EventService[] = servicesFittingRequest.getServices();
    res.status(200).send(serviceAOfFittingRequest.map(e => e.toSimplification()))
  } catch (error) {
    console.log(error.message);
    res.status(404);
    res.send('error in backend at getServiceFilter ' + error.message);

  }
})


export const SearchController: Router = router;
