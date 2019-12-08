import {Router, Request, Response} from 'express';
import {DbServices} from '../services/db.services'
import {User} from "../models/user.model";
import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import {EmailForgotPWServices} from "../services/emailServices/emailForgotPW.services";


const dbService = new DbServices();
const router: Router = Router();


/**
 * listens to HTTP Client POST events when user sign up
 * returns error if password or email is incorrect(404) or
 * if user is not verified yet (email address) (406)
 * sends ok (200) if request was ok
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
   if(error.errorCode==931){
      res.status(406);
      res.send('Verification error');
      console.log(error)
    } else {
      res.status(404).send('Password error');
      console.log(error);
    }

  }
});

/**
 * listens to HTTP Client POST events when user forgot Password
 * returns error if error occurred because mail is not known (404)
 * or if another error occurred in the database (400)
 * sends 'reset Passwort sent' if request was ok (201)
 */
router.post('/forgotPassword', async (req: Request, res: Response) => {
  const email = req.body.email;

  try {
    let user: User = await dbService.getUserFromEmail(email);
    await EmailForgotPWServices.sendMailToUser(user);
    res.statusCode = 201;
    res.json('reset Password sent');

  } catch (error) {
    console.log('this is the error' + error);
    if(error.errorCode==920){
    res.statusCode = 400;
    res.send(error.message);

  }else{
      res.statusCode = 404;
      res.send(error.message);
    }
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
    const token = req.body.token;
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
    await dbService.resetPassword(userEmail, newPWhash);
    console.log('got after db');
    res.status(200);
    res.json('Password was successfully changed');
  } catch (error) {
    if (error.message=='jwt expired') {
      res.status(401).json('Access token expired');
      console.log(error);
    } else {
      res.status(406);
      res.send('invalid Token' + error);
      console.log(error);
    }
  }

};

/**
 * HTTP eventlistener to /resetPassword/:token Events and then calling verify Token
 */
router.post('/resetPassword', verifyToken);


export const LoginController: Router = router;

