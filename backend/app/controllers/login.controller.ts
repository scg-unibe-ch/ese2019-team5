/*import {Router, Request, Response} from 'express';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import {find} from 'tslint/lib/utils';
 const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
const {email, password} = body;
// ToDo: How can I access DB?
 const user = DB.find(x => x.email === email && x.password === password);
  if (!user) { return error('email address or password is incorrect'); }
  return ok( {
    id: user.id,
    email: user.email,
    token: 'fake-jwt-token' // ToDo: Generate JWT
  });
});

// helper functions
  function ok(body?: {
      id: any; email: any; token: string;
      }) {
    return of(new HttpResponse({status: 200, body}));
  }

  function error(message: string) {
    return throwError( { error: {message} } );
  }

  export const LoginController: Router = router;*/

