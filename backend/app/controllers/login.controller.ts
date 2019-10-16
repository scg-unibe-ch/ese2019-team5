import {Router, Request, Response} from 'express';

import {DbServices} from '../db.services';

const dbService = new DbServices();
const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const email = req.body.email; // evt auch req.params.email
  const pwhash = req.body.pwhash;

  try {
    const sessionToken = dbService.tryLogin(email, pwhash);
    res.send(sessionToken);
    res.statusCode = 200;
  } catch (error) {
    res.statusCode = 404;
    res.send(error.msg);
  }
});














/*






// helper functions
  function ok(body?: {
      id: any; email: any; token: string;
      }) {
    return of(new HttpResponse({status: 200, body}));
  }

  function error(message: string) {
    return throwError( { error: {message} } );
  }
*/

  export const LoginController: Router = router;

