import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';
import {Address} from "../models/address.model";
import {EmailVerificationServices} from '../services/emailVerification.services';
import {DbServices} from '../services/db.services';

var jwt = require('jsonwebtoken');
import * as fs from 'fs';

const router: Router = Router(); // part of express needed

// keys for jwt token
const publicKey = fs.readFileSync('./app/services/public.key', 'utf8');

// create new DBService
const dbService = new DbServices();


/**
 * reacts on HTTP Client POST events by sending Mail to new user and adding the user to DB
 */
router.post('/', async (req: Request, res: Response) => {
  const address = new Address(req.body.street,req.body.housenumber, req.body.zip, req.body.city);
  const isVerified: boolean= false;
  const user = new User(req.body.firstname, req.body.lastname, req.body.email, req.body.pwhash,address, isVerified);

  try {
    await dbService.signUp(user);

    EmailVerificationServices.sendMailToNewUser(user);
    res.statusCode = 201;
    res.json('sign up success');

  } catch (e) {
    res.statusCode = 400;
    res.send(e);

  }
});

//TODO auf andere HTTP lösen warten bis Frontend dort ist
/**
 * Method used to verify jwt token
 * @param req from HTTP client
 * @param res answer to client that verifiyng token worked and therefore user is no verified or error
 */
const verifyToken = async (req: Request, res: Response) => {
  const tokenUrl = req.url;
  const token = tokenUrl.substring(tokenUrl.lastIndexOf('/') + 1);

  const verifyOptions = {
    issuer: 'Eventdoo',
    subject: req.body.email,
    audience: req.body.email,
    expiresIn: '24h',
    algorithm: 'RS256'
  };

  try {
    let decoded = jwt.verify(token, publicKey, verifyOptions);
    await dbService.makeUserVerified(decoded.email);
    res.status(200);
    res.send('Thank you for verifying your email-address you can now login.');
  } catch (err) {
    res.send(err);
  }

};

router.get('/confirmation/:token', verifyToken);


/**
 * Reacts on sendMailAgain events using HTTP Client
 * will resend the email so user can verify and then login
 * //TODO button missing forntend warten
 */
router.get('/sendMailAgain', async (req: Request, res: Response) => {
    let email: string = req.params.email;
    try {
      const userWithoutMail = await dbService.getUserFromEmail(email);
      EmailVerificationServices.sendMailToNewUser(userWithoutMail);
      res.status(200);
      res.send('The email was sent again please also check your spam folder. Thank you');
    } catch (e) {
      res.status(404);
      res.send(e + 'unknown email-address. Please check or sign up.');
      console.log(e);
    }

  }
);


export const SignupController: Router = router;
