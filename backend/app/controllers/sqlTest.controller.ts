// this is a test file to test the database connection and the functions of db.service.ts while developing

import {Router, Request, Response} from 'express';
import {SqlResult} from '../models/sqlresult.model';
import {DbServices} from '../services/db.services';
import {User} from '../models/user.model';


const router: Router = Router();
const dbService = new DbServices();
router.get('/', async (req: Request, res: Response) => {

  res.statusCode = 200;
  res.send('Welcome to SQLTest');
});

router.get('/:name', async (req: Request, res: Response) => {
  const name = req.params.name;
  let sql: SqlResult;
  try {
    sql = await dbService.getSqlResult(name);
    res.statusCode = 200;
    res.send('Welcome to Express ' + sql.user[0].toNameString());
  } catch (e) {
    console.log(e);
    res.statusCode = 404;
    res.send('no user with lastname ' + name + ' found in database');
  }
});

router.get('/getUserFromMail/:mail', async (req: Request, res: Response) => {
  const mail = req.params.mail;
  let user: User;
  try {
    user = await dbService.getUserFromEmail(mail);
    res.statusCode = 200;
    res.send(user.toNameString());
  } catch (e) {
    console.log(e);
    res.statusCode = 404;
    res.send('no user with this email: ' + mail +  '  found');
  }

});
/*
router.get('/testEmail/:mail', async(req: Request, res: Response) => {
  const mail = req.params.mail;
  try {
    const state = await dbService.checkIfMailIsUnique(mail);
    console.log(state);
    if(state){
      res.statusCode = 200;
      res.send("true");
    } else{
      res.statusCode = 200;
      res.send("false");
    }
  }catch (e) {
    res.statusCode = 404;
    res.send(e.msg);
  }
});

router.get('/createUser/:z', async(req: Request, res: Response) => {
  const user = new User('Simon', 'Guyer','simon.guyer@gmail.com','pwGuyer',false);
  try {
    var id = await dbService.createUserInDB(user);
    res.statusCode = 404;
    res.send('ok' + String(id));
  }catch (e) {
    console.log(e);
    res.statusCode = 200;
    res.send('nope');
  }
});

 */

router.get('/trySignUp/:z', async(req: Request, res: Response) => {
  const user = new User('Simon', 'Guyer','simon.guyer@gmail.com','pwGuyer',false);
  try {
    var id = await dbService.signUp(user);
    res.statusCode = 200;
    res.send('ok' + String(id));
  }catch (e) {
    console.log(e);
    res.statusCode = 200;
    res.send(e.msg);
  }
});

router.get('/tryMakeUserVerified/:z', async(req: Request, res: Response) => {

  try {
    await dbService.makeUserVerified('rohrbach.cyrill@bluewin.ch');
    res.statusCode = 200;
    res.send('ok');
  }catch (e) {
    console.log(e);
    res.statusCode = 200;
    res.send(e.msg);
  }
});

export const SqlTestController: Router = router;
