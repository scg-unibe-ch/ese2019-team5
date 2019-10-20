// import everything from express and assign it to the express variable
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';



// import all the controllers. If you add a new controller, make sure to import it here as well.
import {Sequelize} from 'sequelize-typescript';
 // import {UserModel} from './user.model'; //TODO wieder entkommentieren
import {SignupController, WelcomeController} from './controllers';
import {SqlTestController} from './controllers';
import {LoginController} from './controllers';


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

app.engine('handlebars', exphbs());
app.set( 'view engine', 'handlebars');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

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

app.use('/welcome', WelcomeController);
app.use('/signup', SignupController);
app.use('/sqlTest', SqlTestController);
app.use('/login', LoginController);


sequelize.sync().then(() => {
// start serving the application on the given port
  app.listen(port, () => {
    // success callback, log something to console as soon as the application has started
    console.log(`Listening at http://localhost:${port}/`);
  });
});
module.exports= app;
