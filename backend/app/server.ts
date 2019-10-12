// import everything from express and assign it to the express variable
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
// import nodemailer from 'nodemailer';
import path from 'path'; // unsure if used

// import all the controllers. If you add a new controller, make sure to import it here as well.
import {Sequelize} from 'sequelize-typescript';
 // import {UserModel} from './user.model'; //TODO wieder entkommentieren
import {UserController} from './controllers/user.controller';
import {WelcomeController} from './controllers';
import {User} from './Server (GC)/user';
import {EmailVerification} from './Server (GC)/emailVerification';



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

// from e-mail verification from here to and with app.get

// View engine setup Also Ansicht //TODO Frontend link zu Formansicht herstellen via path glaubs

app.engine('handlebars', exphbs());
app.set( 'view engine', 'handlebars');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())


// static folder unsure where it is used //TODO find out which our one is
// app.use('/public , express.static( path.join(__dirname, 'public')));

app.get ('/', (req, res) => {
  res.send('Hello');
});
app.get('/signUp', (req: Request, res: Response) => {

  const user = new User(req.body.email, req.body.name, req.body.surname, req.body.pwhash, req.body.isVerified, req.body.isAdmin);
  EmailVerification.sendMailToNewUser(user.email); });

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
