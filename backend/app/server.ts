// import everything from express and assign it to the express variable
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';



// import all the controllers. If you add a new controller, make sure to import it here as well.
import {Sequelize} from 'sequelize-typescript';
 // import {UserModel} from './user.model'; //TODO wieder entkommentieren
import {UserController, WelcomeController} from './controllers';
import {User} from './Server (GC)/user';
import {EmailVerification} from './Server (GC)/emailVerification';
var jwt = require('jsonwebtoken');
import * as fs from 'fs';


const gillianuser = new User('gillian.cathomas@gmx.ch', 'Gillian', 'Will', '1', false, false); // TODO to delete
const publicKey = fs.readFileSync('./app/Server (GC)/public.key', 'utf8');

const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});
// sequelize.addModels([UserModel]); // TODO entkommentieren



// cors to make request between differen ports
const cors = require('cors');


// create a new express application instance
const app: express.Application = express();

app.use(express.json());

app.use(cors());


// View engine setup Also Ansicht //TODO Frontend link zu Formansicht herstellen via path glaubs

app.engine('handlebars', exphbs());
app.set( 'view engine', 'handlebars');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

// define the port the express app will listen on // the port we will use
var port = 3000;
if (process.env.PORT !== undefined) {
  port = parseInt(process.env.PORT);
}

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.use('/todolist', TodoListController);
// app.use('/todoitem', TodoItemController);
app.use('/welcome', WelcomeController);
app.use('/user', UserController);





sequelize.sync().then(() => {
// start serving the application on the given port
  app.listen(port, () => {
    // success callback, log something to console as soon as the application has started
    console.log(`Listening at http://localhost:${port}/`);
  });
});


/*app.get ('/', (req, res) => {
  res.send('Hello');
});
app.get('/user', (req: Request, res: Response) => {




// const user = new User(req.body.email, req.body.name, req.body.surname, req.body.pwhash, req.body.isVerified, req.body.isAdmin);
  EmailVerification.sendMailToNewUser(gillianuser);
res.send('Hello from user');
});


app.get ('user/confirmation/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2lsbGlhbiIsInN1cm5hbWUiOiJXaWxsIiwiZW1haWwiOiJnaWxsaWFuLmNhdGhvbWFzQGdteC5jaCIsImlhdCI6MTU3MDk2NDg4OCwiZXhwIjoxNTcxMDUxMjg4LCJhdWQiOiJnaWxsaWFuLmNhdGhvbWFzQGdteC5jaCIsImlzcyI6IkV2ZW50ZG9vIiwic3ViIjoiZ2lsbGlhbi5jYXRob21hc0BnbXguY2gifQ.cfTinprfbLZSusu1wgOaYrNaT6Qx-gm9B1aG3ZipElQgsiUOFdT07-IlGIQSLZ4_5wBUMg--2tzPlH3RvWmJBw', async (req: Request, res: Response) => {
  try {
    const emailToken = req.params.emailURl; // TODO unsure if it works
    const verifyOptions = {
      issuer: 'Eventdoo',
      subject: req.body.email,
      audience: req.body.email,
      expiresIn: '24h',
      algorithm: 'RS256'};


    jwt.verify(emailToken, publicKey, verifyOptions);
    res.send('Hello from user with token');
  } catch (err) {
    res.send(err);
  }
});*/
