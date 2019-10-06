//TODO const gross schreiben? ausser TODOs ist hier nix mehr wichtig evt nicht mal todos

//TODO fehlt Error handling 14 signUp.service.ts import {catchError} from rxjs/operators; import {throwError}from rxjs;
// express is the webserver
const express= require('express');
//middleware to handle form data
const bodyParser= require('body-parser');
//cors to make request between differen ports
const cors= require('cors');

//port which we will use
const PORT = 3000;

//create instance of express
const app= express();

app.use(bodyParser.json());

app.use(cors());

//get function to root
app.get('/',function (req,res) {
  res.send("Hello from server");
})

//TODO which name do we give it '/sign up ? und im Signup.service.ts in class _url='http://localhost:3000/signUp';
//TODO Nr 13  ab 5:30 damit nach submit auch damit weg
//Endpoint where Formdata is sent to
app.post('/signUp', function (req,res){
res.status(200).send({"message" : "Data received" })
})



app.listen(PORT,function () {
  console.log("running server"+PORT);

});
