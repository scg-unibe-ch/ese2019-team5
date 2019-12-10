import express from 'express';
import exphbs from 'express-handlebars';
import {
  SignupController,
  SqlTestController,
  LoginController,
  EventserviceController,
  SearchController,
  ProfileController
} from './controllers';

/**
 * This file sets up the server of the backend to accept and respond to the HTTP requests from the frontend.
 */

var bodyParser = require('body-parser');

// cors to make request between different ports
const cors = require('cors');
// create a new express application instance
const app: express.Application = express();

// tell the app to use express.json objects with an max of 50MB
app.use(express.json({limit: '50mb'}));

app.use(cors());

app.engine('handlebars', exphbs());
app.set( 'view engine', 'handlebars');

// Tell the app to use bodyparser urlencoded and json with an limit of 50MB
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit:'50mb'}));

// set the port the app listens to
var port = 3000;
// if there is already a port set it should use this so the port variable gets overridden
if (process.env.PORT !== undefined) {
  port = parseInt(process.env.PORT);
}

// The functions used for the HTTP requests
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Specify the urls of the used controllers
app.use('/signup', SignupController);
app.use('/sqlTest', SqlTestController);
app.use('/login', LoginController);
app.use('/profile', ProfileController);
app.use('/eventservice', EventserviceController);
app.use('/search',SearchController);

// starting the application
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

module.exports = app;
