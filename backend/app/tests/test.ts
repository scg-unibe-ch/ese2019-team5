
// let chaii = require('chai');
var should = require('should');
var request = require('request');
var expect = require('chai').expect;
var baseUrl= 'localhost:3000';
var util = require('util');
// var router = require('./controllers/signup.controller.ts');
//requrie (app) from "../server.ts";
var app = require('../server');
describe('Index Test', () =>{
it ('should always pass', function () {
  expect(true).to.equal(true);});
});

it('test post', async function () {
  const res = await request(app).get('/signup');
  expect(res.statusCode).to.equal(201);

})




describe('Post Event for Signup',function () {
  it ('returns verify your email',function (done) {
    request.post({url:baseUrl + '/signup'},
      function (error : any ,response: any, body: any) {
      expect(response.statusCode).to.equal(201);
      console.log(body);
      done();

      });

  });

});


/*

// import {SignupController} from '../controllers';
import 'mocha';

let server = require('../app');
let chaiHttp= require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const assert= chai.assert;



describe( 'POST Event for Signup',() => {
  test('should return "please verify your email"', function(done){
    chai.request(server)
      .post('/signup')
      .expect("Content-type", /json/)
      .expect(201)
      .end(function (err, res) {
        res.status.should.equal (201);

        res.body.error.should.equal(false);
        done();
         });
  });
});
*/
