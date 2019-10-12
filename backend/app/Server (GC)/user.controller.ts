import {Router, Request, Response} from 'express';
import {User} from './user';
import nodemailer from 'nodemailer';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import {EmailVerification} from './emailVerification';
// import {emailVerification}form './emailVerification'


// just started here
const router: Router = Router(); // part of express needed

// when frontend signs up a new User is created which is saved (or at least should be)
router.post('/signUp', async (req: Request, res: Response) => {

  const user = new User(req.body.email, req.body.name, req.body.surname, req.body.pwhash, req.body.isVerified, req.body.isAdmin);
  EmailVerification.sendMailToNewUser(user.email);

  // user.formSimplification(req.body); //TODO hier noch totales Durcheinander
  // await user.save();
  // call E-Mail verification fehlt //TODO E-Mail hier?
  res.statusCode = 201 ;
 // res.send(user.toSimplification());
});

// E-Mail verification Methode oder so ähnlich
// create reusable transporter object using the default SMTP transport
// credentials for our server
// so far si able to send e-mails to one person and of a certain type // TODO gehört das überhaupt hierher?
/*
async function sendMailToNewUser(email: string) {

try{
  const transporter = nodemailer.createTransport({
    host: 'mail.gmx.net',
    port: 993,
    secure: false,
    auth: {
      user: 'ESEteam5@gmx.de',
      pass: 'WecandoIt19'
    },
    tls: { // because we are not on that host currently.... just those 2 lines
      rejectUnauthorized: false
    }
  });
  emailVerification.makeToken();


// send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"ESETeam5" <ESEteam5@gmx.de>', // sender address
    to: 'will123459@gmail.com', // email, // list of receivers
    subject: 'E-Mail Verification for your ESETeam5 Account',
    text: 'Hello world?', // plain text body
    html: '<b>Please verify your e-mail address</b>' // html body//TODO noch schön anpassen
  });



    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


} catch (Error) { // ersetzt das unten dran
  console.error();
}}
// sendMailToNewUser(user.email).catch(console.error);
*/


// TODO noch mals so ne function die ich keine Ahnung hab wo sie überhaupt hingehört, was für models und dann wären da noch Secret, Secret_2
// vom 2 Teil
// if user that wants to login was not found = Invalid login, if User isn't verified user is being told to verify

// sollte helfer funktion zu db hat und  und hier nur token oder so machen
/*
async function tryLogin(email, password, models) {
  /!*const user = await models.User.findOne({where: {email}, raw: true}); // TODO denke das hängt schon mit DB zusammen oder?
  if (!user) {
    throw new Error('Invalid login, please check your email address');
  }
  if (user.isVerified) {
    throw new Error ('Please confirm your email address');
  }
  const valid = await brcypt.compare(password, user.password); // TODO auch wieder DP??
  if (!valid) {
    throw new Error ('Invalid password');
  }*!/
  // all das mit DB machen
 const [token, refreshToken] = await makeTokens(user, SECRET, SECRET_2 + user.password);
}

async function makeToken (){
  const emailToken= jwt.sign({
    user: _.pick(user, 'id'),
  }),EMAIL_SECRET,
    {
      expiresIn: '1d',
    },

    const url= `http://localhost:3000/confirmation/${emailToken}`;

  await transporter.sendMail();
}

*/

// router.get('/', async (req: Request, res: Response) => {
/*  const todoListID = parseInt(req.query.todoListId);
  let options = {};
  if (todoListId != null) {
    options = {
      include: [{
        model: TodoList,
        where: {
          id: todoListId
        }
      }]
    };
  }
  const instances = await TodoItem.findAll(options);
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});*/
/*

router.post('/', async (req: Request, res: Response) => {
  const instance = new TodoItem();
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 201;
  res.send(instance.toSimplification());
});
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await TodoItem.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  res.statusCode = 200;
  res.send(instance.toSimplification());
});
router.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await TodoItem.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 200;
  res.send(instance.toSimplification());
});
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await TodoItem.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.destroy();
  res.statusCode = 204;
  res.send();
});
*/

export const UserController: Router = router;
