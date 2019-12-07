import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';
import {Address} from "../models/address.model";
import {EmailVerificationServices} from '../services/emailServices/emailVerification.services'
import * as fs from 'fs';
import {UserBuilder} from "../models/userBuilder.model";
import {DbServices} from '../services/db.services';
import {error} from "ts-postgres/dist/src/logging";

var jwt = require('jsonwebtoken');

const router: Router = Router();

// keys for jwt token
const publicKey = fs.readFileSync('./app/services/public.key', 'utf8');

// create new DBService
const dbService = new DbServices();


/**
 * reacts on HTTP Client POST /signup events by sending Mail to new user and adding the user to DB
 * returns 201 (created) if signup worked and 400 otherwise
 *
 */
router.post('/', async (req: Request, res: Response) => {
  const address = new Address(req.body.street, req.body.housenumber, req.body.zip, req.body.city);

  const user: User = UserBuilder.user()
    .setFirstname(req.body.firstname)
    .setLastname(req.body.lastname)
    .setEmail(req.body.email)
    .setPwhash(req.body.pwhash)
    .setIsVerified(false)
    .setAddress(address)
    .build();

  try {
    await dbService.signUp(user);
    EmailVerificationServices.sendMailToUser(user);
    res.statusCode = 201;
    res.json('sign up success');

  } catch (error) {//TODO andere errors?
    console.log(error);
    console.log(error.message);

    res.status(400).send(error.message);
    console.log(res.statusCode);

  }

});


/**
 * Method used to verify jwt token
 * @param req from HTTP client
 * @param res answer to client that verifiyng token worked and therefore user is no verified or error
 */
const verifyToken = async (req: Request, res: Response) => {

  try {
    const tokenUrl = req.url;
    const token = tokenUrl.substring(tokenUrl.lastIndexOf('/') + 1);
    const verifyOptions = {
      issuer: 'Eventdoo',
      subject: req.body.email,
      audience: req.body.email,
      expiresIn: '24h',
      algorithm: 'RS256'
    };


    let decoded = jwt.verify(token, publicKey, verifyOptions);

    await dbService.makeUserVerified(decoded.email);

    res.status(200);
    res.send('Thank you for verifying your email-address you can now login.');
  } catch (error) {

    if (error.name === 'TokenExpiredError') {
      res.status(401).send('Access token expired');
    } else {
      res.status(406);
      res.send('invalid Token' + error);
    }
  }

};

router.get('/confirmation/:token', verifyToken);


/**
 * Reacts on sendMailAgain events using HTTP Client
 * will resend the email so user can verify and then login
 *
 */
router.post('/sendMailAgain', async (req: Request, res: Response) => {
    let email: string = req.body.email;

    try {
      const userWithoutMail = await dbService.getUserFromEmail(email);
      await EmailVerificationServices.sendMailToUser(userWithoutMail);
      res.status(200);
      res.json('The email was sent again please also check your spam folder. Thank you');
    } catch (error) {
      res.status(404);
      res.send(error + 'unknown email-address. Please check or sign up.');
      console.log(error);
    }

  }
);


export const SignupController: Router = router;
