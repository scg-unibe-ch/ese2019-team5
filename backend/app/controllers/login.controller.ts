import {Router, Request, Response} from 'express';
import {DbServices} from '../services/db.services'
import {User} from "../models/user.model";
import {EmailForgotPWServices} from '../services/emailForgotPW.services';
import jwt, {TokenExpiredError} from 'jsonwebtoken';
import * as fs from 'fs';


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
    const user = loginResult.user;

    const lRes = {
      'user': user,
      'token': sessionToken
    };

    res.send(lRes);
    res.statusCode = 200;
  } catch (error) {
    let message: string = error.message;
    if (message.localeCompare('To login, please verify your email-address') == 0) { //TODO aufräumen .....
      console.log("error in backend:" + error.message);
      // res.status(404).send(error.message);
      res.status(406);
      res.send('Verification error');
    } else {
      res.status(404).send('Password error');
    }

  }
});

/**
 * listens to HTTP Client POST events when user forgot Password
 * returns error if error occured because mail is not known
 * sends 'reset Passwort sent' if request was ok
 */
router.post('/forgotPassword', async (req: Request, res: Response) => {
  const email = req.body.email;
  console.log('got to forgot password');
  try {
    let user: User = await dbService.getUserFromEmail(email);
    await EmailForgotPWServices.sendMailToUser(user);


    res.statusCode = 201;
    res.json('reset Password sent');

  } catch (error) {
    console.log('this is the error' + error)
    res.statusCode = 400;
    res.send(error);

  }

});

/**
 * verify Method for token that is sent by mail
 * @param req which has the URL in it
 * @param res ok (200) if password could be changed
 * 401 if token is expired otherwise 406 if token is manipulated or
 * invalid otherwise
 */
const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.body.token; //req.url
    const newPWhash: string = req.body.password;
    let userEmail: string;
    const notVerified = jwt.decode(token);

    if (notVerified === null) {
      userEmail = 'a@b.ch';
    } else {
      userEmail = notVerified['sub']
    }

    const publicForgotPWKey = fs.readFileSync('./app/services/publicForgotPWKey.key', 'utf8');

    const verifyOptions = {
      issuer: 'Eventdoo',
      subject: req.body.email,
      audience: req.body.email,
      expiresIn: '24h',
      algorithm: 'RS256'
    };

    let decoded = jwt.verify(token, publicForgotPWKey, verifyOptions);
    console.log('gotbefore db');
    console.log(newPWhash + " " + String(userEmail));
    await dbService.resetPassword(userEmail, newPWhash);
    console.log('got after db');
    res.status(200);
    res.json('Password was successfully changed');

  } catch (error) {
    if (error.name.localeCompare('TokenExpiredError')) {
      res.status(401).send('Access token expired');
      console.log(error)
    } else {
      res.status(406);
      res.send('invalid Token' + error);

    }
  }

};

/**
 * HTTP eventlistener to /resetPassword/:token Events and then calling verify Token
 */
router.post('/resetPassword', verifyToken);


export const LoginController: Router = router;

