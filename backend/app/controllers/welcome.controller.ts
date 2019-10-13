import {Router, Request, Response} from 'express';
import {EmailVerification} from '../Server (GC)/emailVerification';
import {User} from '../Server (GC)/user';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.statusCode = 200;
  res.send('Welcome to Express');
});

router.get('/:name', async (req: Request, res: Response) => {
  const name = req.params.name;
  res.statusCode = 200;
  res.send('Welcome to Express ' + name);
});


export const WelcomeController: Router = router;
