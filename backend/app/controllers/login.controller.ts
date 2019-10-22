import {Router, Request, Response} from 'express';

import {DbServices} from '../services/db.services'


const dbService = new DbServices();
const router: Router = Router();

/**
 * listens to HTTP Client POST events when user sign up
 * returns error if password or email is incorrect or
 * if user is not verified yet (email address)
 * sends ok if request was ok
 */
router.post('/', async (req: Request, res: Response) => {
  const email = req.body.email;
  const pwhash = req.body.pwhash;

  try {

    const loginResult = await dbService.tryLogin(email, pwhash);
    const sessionToken = loginResult.token;
    const user= loginResult.user;

    const lRes = {
      'user': user,
      'token': sessionToken
    };

    res.send(lRes);
    res.statusCode = 200;
  } catch (error) {
    console.log("error in backend:" + error.message);
    res.status(404).send(error.message);
  }
});


  export const LoginController: Router = router;

