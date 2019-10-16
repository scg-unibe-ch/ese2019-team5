import {Router, Request, Response} from 'express';
import {SqlResult} from '../models/sqlresult.model';
import {DbServices} from '../db.services';
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

export const SqlTestController: Router = router;
