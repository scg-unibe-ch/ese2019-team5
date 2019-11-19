import express, {Request, Response} from 'express';
//import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';

// import all the controllers. If you add a new controller, make sure to import it here as well.
import {Sequelize} from 'sequelize-typescript';
import {
  SignupController,
  SqlTestController,
  LoginController,
  EventserviceController,
  SearchController
} from './controllers'; // ProfileController
import {ProfileController} from "./controllers";


const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});


var bodyParser = require('body-parser');

// cors to make request between differen ports
const cors = require('cors');
// create a new express application instance
const app: express.Application = express();

app.use(express.json({limit: '50mb'}));

app.use(cors());

app.engine('handlebars', exphbs());
app.set( 'view engine', 'handlebars');

app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser());


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

//app.use('/welcome', WelcomeController);
app.use('/signup', SignupController);
app.use('/sqlTest', SqlTestController);
app.use('/login', LoginController);
app.use('/profile', ProfileController);
app.use('/eventservice', EventserviceController);
app.use('/search',SearchController);


sequelize.sync().then(() => {
// start serving the application on the given port
  app.listen(port, () => {
    // success callback, log something to console as soon as the application has started
    console.log(`Listening at http://localhost:${port}/`);
  });
});

module.exports = app;
