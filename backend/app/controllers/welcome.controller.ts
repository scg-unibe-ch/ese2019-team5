import {Router, Request, Response} from 'express';
import {EmailVerification} from '../Server (GC)/emailVerification';

const router: Router = Router();
router.get('/', async (req: Request, res: Response) => {
  console.log('getrouter. before email verification');
  EmailVerification.sendMailToNewUser('gillian.cathomas@gmx.ch');
  console.log('after email verification');
  res.statusCode = 200;
  res.send('Welcome to Express');
});

router.get('/:name', async (req: Request, res: Response) => {
  const name = req.params.name;
  res.statusCode = 200;
  res.send('Welcome to Express ' + name);
});


export const WelcomeController: Router = router;
