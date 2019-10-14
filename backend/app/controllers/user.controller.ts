import {Router, Request, Response, urlencoded} from 'express';
import {User} from '../Server (GC)/user';
import {EmailVerification} from '../Server (GC)/emailVerification';
// import jwt from 'jsonwebtoken';
var jwt = require('jsonwebtoken');
import * as fs from 'fs';


const router: Router = Router(); // part of express needed
const gillianuser = new User('gillian.cathomas@gmx.ch', 'Gillian', 'Will', '1', false, false); // TODO to delete
// when frontend signs up a new User is created which is saved (or at least should be)

// keys for jwt token
const privateKey = fs.readFileSync('./app/Server (GC)/private.key', 'utf8');
const publicKey = fs.readFileSync('./app/Server (GC)/public.key', 'utf8');


router.post('/', async (req: Request, res: Response) => {

  const user = new User(req.body.email, req.body.name, req.body.surname, req.body.pwhash, req.body.isVerified, req.body.isAdmin);
  EmailVerification.sendMailToNewUser(user);

//  DB.createUser(user) // TODO hier noch logik um DB ein user zu erstellen

  res.statusCode = 201 ;
  res.send('Welcome to Express');
  console.log ('post method executed');
 // res.send(user.toSimplification());
});



router.get('/', async (req: Request, res: Response) => {

  // const user = new User(req.body.email, req.body.name, req.body.surname, req.body.pwhash, req.body.isVerified, req.body.isAdmin);

  EmailVerification.sendMailToNewUser(gillianuser);
  res.statusCode = 200 ;
  res.send('Welcome to Express2');


});

/*
router.get('/', (req: Request, res: Response) => {

  // const user = new User(req.body.email, req.body.name, req.body.surname, req.body.pwhash, req.body.isVerified, req.body.isAdmin);
  EmailVerification.sendMailToNewUser(gillianuser);
  res.statusCode = 200;
  res.send('Hello from user');

});
*/


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
    // DB.makeUserVerified(req.body.email);
  res.send('jwt token was verified :)');
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
    const emailToken = req.params.emailUrl; // TODO unsure if it works
    const verifyOptions = {
      issuer: 'Eventdoo',
      subject: req.body.email,
      audience: req.body.email,
      expiresIn: '24h',
      algorithm: 'RS256'};


  jwt.verify(emailToken, publicKey, verifyOptions);
  console.log(' verifie funktioniert'); // TODO noch User auf verified setze
   // DB.makeUserVerified(req.body.email);
} catch (err) {
    res.status(401);
    res.send(err);
}
});

router.get('/sendMailAgain', async (req: Request, res: Response) => {
 let email: string = req.params.email;
 let userWithoutMail: User = DB.getUserFromEmail(email); // TODO zu implementieren Cyrill pls?
 EmailVerification.sendMailToNewUser(userWithoutMail);

// TODO get all infos about user and call EmailVerification.sendMailToNewUser again with those infos
  }

// TODO zum implementieren
)



// if user that wants to login was not found = Invalid login, if User isn't verified user is being told to verify



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
