import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';
import {EmailVerificationServices} from '../services/emailVerification.services';
import {DbServices} from '../services/db.services';
var jwt = require('jsonwebtoken');
import * as fs from 'fs';


const router: Router = Router(); // part of express needed

// keys for jwt token
const publicKey = fs.readFileSync('./app/services/public.key', 'utf8');

// create new DBService
const dbService = new DbServices();

//reacts on HTTP Client post events by sending Mail to new user and adding the user to DB
router.post('/', async (req: Request, res: Response) => {

  const user = new User( req.body.firstname, req.body.lastname, req.body.email, req.body.pwhash, req.body.isVerified);
  console.log(req.body.firstname);
  console.log(req.body.lastname);
  console.log(req.body.pwhash);
  console.log(req.body.email);
  console.log(req.body.isVerified);


  try{
    await dbService.signUp(user);
    EmailVerificationServices.sendMailToNewUser(user);
    res.statusCode = 201 ;
    res.send("Please check your emails and verify your email-address in order to sign up. If you can't find it please also check your spam folder");// TODO hier noch richtige antwort senden Z.B.

  } catch (e) {
    console.log(e);
    res.statusCode = 400;
    res.send(e.msg); // TODO diese Message wird dem User noch nicht ausgegeben.
  }

});





// needed to verify the token
const verifyToken = (req: Request, res: Response) => {
const tokenUrl = req.url;
const token = tokenUrl.substring(tokenUrl.lastIndexOf('/') + 1);

  const verifyOptions = {
    issuer: 'Eventdoo',
    subject: req.body.email,
    audience: req.body.email,
    expiresIn: '24h',
    algorithm: 'RS256'};

  try {
  jwt.verify(token, publicKey, verifyOptions ) ;
// TODO logik um user auf verified zu stellen und evt res.send ändern
    dbService.makeUserVerified(req.body.email);
  res.send('Thank you for verifying your email-address you can now login.');
} catch (err) {
    res.send(err);
  }

  }

router.get('/confirmation/:token', verifyToken); // hier wird drauf zugegriffen
// router.post('/confirmation/:token', verifyToken);
// router.patch('/confirmation/:token', verifyToken);



router.patch('/confirmation/:emailToken', async (req: Request, res: Response) => {
  try {

    const tokenUrl = req.url;
    const token = tokenUrl.substring(tokenUrl.lastIndexOf('/') + 1);
    const emailToken = req.params.emailUrl;
    const verifyOptions = {
      issuer: 'Eventdoo',
      subject: req.body.email,
      audience: req.body.email,
      expiresIn: '24h',
      algorithm: 'RS256'};


  jwt.verify(emailToken, publicKey, verifyOptions);
  console.log(' verifie funktioniert');
   dbService.makeUserVerified(req.body.email);
} catch (err) {
    res.status(401);
    res.send(err);
}
});

// reacts on sendMailAgain events if user has not found the email or lost it.
router.get('/sendMailAgain', async (req: Request, res: Response) => {
 let email: string = req.params.email;
 try{
   const userWithoutMail = await dbService.getUserFromEmail(email);
   EmailVerificationServices.sendMailToNewUser(userWithoutMail);
   res.status(200);
   res.send('The email was sent again please also check your spam folder. Thank you');
 }catch (e) {
   res.status(404);
   res.send(e + 'unknown email-address. Please check or sign up.');
   console.log(e);
 }
  }

);






export const SignupController: Router = router;
