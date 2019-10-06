// import everything from express and assign it to the express variable
import express from 'express';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
import nodemailer from 'nodemailer';

// import all the controllers. If you add a new controller, make sure to import it here as well.
 import {Sequelize} from 'sequelize-typescript';
 import {User} from './user.model'; // TODO was hier das Problem?
import {UserController} from './user.controller';




const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});
sequelize.addModels([User]);


// middleware to handle form data
const bodyParser = require('body-parser');
// cors to make request between differen ports
const cors = require('cors');


// create a new express application instance
const app: express.Application = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// from e-mail verification from here to and with app.get


app.get ('/', (req, res) => {
  res.send('Hello');
})

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
// app.use('/welcome', WelcomeController);
app.use('/user', UserController)



sequelize.sync().then(() => {
// start serving the application on the given port
  app.listen(port, () => {
    // success callback, log something to console as soon as the application has started
    console.log(`Listening at http://localhost:${port}/`);
  });
});