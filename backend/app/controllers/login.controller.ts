import {Router, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import {generate, Observable, of, throwError} from 'rxjs';
// import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import {find} from 'tslint/lib/utils';
 const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const email = req.body.email; // evt auch req.params.email
  const pwhash = req.body.pwhash;
  // TODO kann es sein dass das evt hinten gemacht werden muss? bei Cyrill??? jwt noch improtieren und fs um private key lesen zu können

  try {
    let sessionToken: string = DB.tryLogin(email, pwhash);
    res.send(sessionToken);
    res.statusCode = 200;
  } catch (error) {
    res.statusCode = 404;
    res.send(error.msg);
  }
}
// TODO ab hier für Cyrill
if(doesUserExistAndIsPasswordCorrect(email, pwhash)) {
  if (isUserVerified) {
    let userId: number = getUserId(email, pwhash);
    return generateJWTToken(email, pwhash);

  } else {
    throwError('To login, please verify your email-address. Thank you your Eventdoo Team');
    // erro senden not verified gute Message
  }
}else {
  throwError('Invalid email-address or password');
  // throw error
}

function generateJWTToken(email, userId): string {
  let payload {userId}= userId;
    var signOptions = {
      issuer: 'Eventdoo',
      subject: email,
      expiresIn: '7d',
      algorithm: 'RS256'};
    let sessionToken :string = jwt.sign(payload, privateKey, signOptions);
    return sessionToken;
  }


// const user = DB.find(x => x.email === email && x.password === password);
/*  if (!user) { return error('email address or password is incorrect'); }
  return ok( {
    id: user.id,
    email: user.email,
    token: 'fake-jwt-token'
  });*/














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

