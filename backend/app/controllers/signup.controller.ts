import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';
import {Address} from "../models/address.model";
import {EmailVerificationServices} from '../services/emailVerification.services';
import {DbServices} from '../services/db.services';

var jwt = require('jsonwebtoken');
import * as fs from 'fs';
import {UserBuilder} from "../models/userBuilder.model";

const router: Router = Router(); // part of express needed

// keys for jwt token
const publicKey = fs.readFileSync('./app/services/public.key', 'utf8');

// create new DBService
const dbService = new DbServices();


/**
 * reacts on HTTP Client POST events by sending Mail to new user and adding the user to DB
 */
router.post('/', async (req: Request, res: Response) => {
  const address = new Address(req.body.street, req.body.housenumber, req.body.zip, req.body.city);
  const isVerified: boolean = false;
  const user: User = UserBuilder.user()
    .setFirstname(req.body.firstname)
    .setLastname(req.body.lastname)
    .setEmail(req.body.email)
    .setPwhash(req.body.pwhash)
    .setIsVerified(isVerified)
    .setAddress(address)
    .build();// TODO addresse hier nach pw hash einfügen??

  try {
    await dbService.signUp(user);
    EmailVerificationServices.sendMailToNewUser(user);
    res.statusCode = 201;
    res.json('sign up success');

  } catch (error) {
    console.log(error.message);
    res.statusCode = 400;
    res.send(error);

  }
});


/**
 * Method used to verify jwt token
 * @param req from HTTP client
 * @param res answer to client that verifiyng token worked and therefore user is no verified or error
 */
const verifyToken = async (req: Request, res: Response) => {
  const tokenUrl: string= req.url;

  const token = tokenUrl.substr(tokenUrl.lastIndexOf('/') +1);
  console.log('haha' + token);
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
  } catch (error) {
    res.send(error);
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
      await EmailVerificationServices.sendMailToNewUser(userWithoutMail);
      res.status(200);
      res.send('The email was sent again please also check your spam folder. Thank you');

    } catch (error) {
      res.status(404);
      res.send(error + 'unknown email-address. Please check or sign up.');
      console.log(error);
    }

  }
);


export const SignupController: Router = router;
