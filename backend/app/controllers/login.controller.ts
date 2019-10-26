import {Router, Request, Response} from 'express';
import {DbServices} from '../services/db.services'
import {User} from "../models/user.model";
import {EmailForgotPWServices} from '../services/emailForgotPW.services';
import jwt from 'jsonwebtoken';
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
    console.log("error in backend:" + error.message);
    res.status(404).send(error.message);
  }
});

router.get('/forgotPassword', async (req: Request, res: Response) => {
  //const email = req.body.email; //TODo entkommentieren
  const email= 'gillian.cathomas@gmx.ch';
  try {
    let user: User =await dbService.getUserFromEmail(email); // TODO wird hier Fehler gesendet wenns noch nicht gibt oder email falsch ist ??
    await EmailForgotPWServices.sendMailToUser(user);

    res.statusCode = 201;
    res.send('reset Password send');

  } catch (e) {
    res.statusCode = 400;
    res.send(e);

  }

});

//TODO irgendwie sicherstellen, dass user nicht einfach so auf passwort zurücksetzen seite kommen kann
const verifyToken = async (req: Request, res: Response) => {
  const tokenUrl = req.url;
  const token = tokenUrl.substring(tokenUrl.lastIndexOf('/') + 1);

  const publicForgotPWKey= fs.readFileSync('./app/services/publicForgotPWKey.key', 'utf8');

  const verifyOptions = {
    issuer: 'Eventdoo',
    subject: req.body.email,
    audience: req.body.email,
    expiresIn: '24h',
    algorithm: 'RS256'
  };

  try {
    let decoded = jwt.verify(token, publicForgotPWKey, verifyOptions);
    await dbService; //TODO reset Password
    res.status(200);
    res.send('Password was successfully changed');
  } catch (err) {
    res.send(err);
    res.status(406);
  }

};

router.get('/resetPassword/:token', verifyToken);


export const LoginController: Router = router;

