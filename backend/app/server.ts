import express from 'express';

import exphbs from 'express-handlebars';


import {
  SignupController,
  SqlTestController,
  LoginController,
  EventserviceController,
  SearchController
} from './controllers';
import {ProfileController} from "./controllers";


var bodyParser = require('body-parser');

// cors to make request between different ports
const cors = require('cors');
// create a new express application instance
const app: express.Application = express();

app.use(express.json({limit: '50mb'}));

app.use(cors());

app.engine('handlebars', exphbs());
app.set( 'view engine', 'handlebars');

app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit:'50mb'}));


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


app.use('/signup', SignupController);
app.use('/sqlTest', SqlTestController);
app.use('/login', LoginController);
app.use('/profile', ProfileController);
app.use('/eventservice', EventserviceController);
app.use('/search',SearchController);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

module.exports = app;
