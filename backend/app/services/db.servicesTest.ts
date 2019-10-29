import {Client} from 'pg';
import {SqlResult} from '../models/sqlresult.model';
import {User} from '../models/user.model';
import * as fs from 'fs';
import {LoginResult} from "../models/loginResult.model";

//const {Client} = require('pg');
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync('./app/services/private.key', 'utf8');
const clientKey = fs.readFileSync('./app/services/client-key.pem').toString();
const clientCert = fs.readFileSync('./app/services/client-cert.pem').toString();
const serverCA = fs.readFileSync('./app/services/server-ca.pem').toString();

export class DbServicesTest {

  /**
   * returns an Client to connect to our database
   */
    private getClient(): Client {

      const config = {
        'user' : 'cyrill',
        'host' : '34.65.95.137',
        //'host' : 'localhost',
        'password' : 'root',
        'port' : 5432,
        'database' : 'eventdoo',
        ssl: {
          rejectUnauthorized : false,
          mode: require,
          ca: serverCA,
          key: clientKey,
          cert: clientCert
        }
      };
      return new Client(config);
    }

    // This function is only for testing purpose
    public async getSqlResult(name: string): Promise<SqlResult> {
      const localClient = this.getClient();
      await localClient.connect(function (err){
        if (err){
          console.log("hllo");
          console.log(err);
        }

        else
          console.log("connected!x")
      });

      try{
        console.log('connected');
        return await this.testSql(name, localClient);
      } finally {
        await localClient.end();
      }
    }

    // for testing only... returns all the users with given lastname
    async testSql( name: string, client: Client): Promise<SqlResult> {
        const sqlResult = new SqlResult();

        client.query('SELECT id As id, prename As pn, lastname As ln, email As email, password As pw, isverified As isv From users Where lastname = $1',[name],(err,res) =>{

          if (err) {
            console.log("hello");
            console.log(err.stack);
          } else {
            console.log(res.rows[0]);
          }
        });

        /*
          .then(res => {
            console.log("hello");
            console.log(res.rows[0])
              const row = res.rows[0];
              const user = new User(String(row.get('pn')), String(row.get('ln')), String(row.get('email')), String(row.get('pw')), Boolean(row.get('isv')))
              user.setId(Number(row.get('id')));
              sqlResult.addUser(user);
            })
          .catch(e => console.error(e.stack));*/

/*
        , [name],(err,res) => {
          if (err) {
            console.log("false ERRROOORR");
            console.log(err.stack);
          } else {
            console.log("hello");


          }
        });*/

        return sqlResult;
    }

}



