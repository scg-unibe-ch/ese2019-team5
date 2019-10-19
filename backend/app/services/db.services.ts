import {Client} from 'ts-postgres';
import {SqlResult} from '../models/sqlresult.model';
import {User} from '../models/user.model';
import * as fs from 'fs';
import {LoginResult} from "../models/loginResult.model";

const jwt = require('jsonwebtoken');

const client = new Client({
    'user' : 'cyrill',
    'host' : 'localhost',
    'password' : 'root',
    'port' : 5432,
    'database' : 'eventdoo'
});
const privateKey = fs.readFileSync('./app/services/private.key', 'utf8');

export class DbServices {
    // This function is only for testing purpose
    public async getSqlResult(name: string): Promise<SqlResult> {
      await client.connect();
      try{
        return await this.testSql(name);
      }finally {
        await client.end();
      }
    }

    public async getUserFromEmail(email: string): Promise<User> {
      await client.connect();
      try{
        return await this.getUserFromEmailDB(email);
      } finally {
        await client.end();
      }
    }

    public async tryLogin(email: string, password: string): Promise<LoginResult> {
      let user: User;
      user = await this.getUserFromEmail(email);
      if (this.checkIfPasswordCorrect(user, password)) {
        if (this.isUserVerified(user)) {
          return new LoginResult(user,this.generateJWT(email, user.id));
        } else {
          throw Error('To login, please verify your email-address');
        }
      } else {
        throw Error('Invalid email-address or password');
      }
    }

    public async signUp(user: User): Promise<number>{
      await client.connect();
      var id = -1;
      try {
        if(await this.checkIfMailIsUniqueDB(user.email)){
          id = Number(await this.creatUserInDB(user));
          user.setId(id);
        } else {
          throw Error('The email address already exists in the database');
        }
      } finally {
        await client.end();
      }
      return id;
    }

    public async makeUserVerified(email: string){
      await client.connect();
      try {
        const user = await this.getUserFromEmailDB(email);
        await this.makeUserVerifiedDB(user);
      } finally {
        await client.end();
      }
    }

    private async makeUserVerifiedDB(user: User){
      await client.query('Update users Set isverified=true Where id = $1', [user.id])
    }

    private async creatUserInDB(user: User): Promise<number>{
      const stream = client.query('Insert into users(prename, lastname,email,password,isverified) Values ($1,$2,$3,$4,$5) Returning id As id',[user.firstname, user.lastname,user.email,user.pwhash,user.isVerified]);
      var id = -1;
      for await (const row of stream){
        id = Number(row.get('id'));

      }
      if(id == -1) {
        throw Error('An error occured while creating the DB entry');
      }

      return id;
    }

  /**
   * takes an email address and checks if an user is allready using this address
   * @param email-address of new User
   */
  private async checkIfMailIsUniqueDB(email: string) : Promise<boolean>{
      const stream = client.query('SELECT email As email FROM users Where email = $1', [email]);
      var counter = 0;
      for await(const row of stream){
        counter ++;
      }
      return (counter == 0);
    }


    private generateJWT(email: string, userId: number): string {
      const payload = {
        data1: String(userId),
      };
      const signOption = {
        issuer: 'Eventdoo',
        audience: 'http://eventdoo.ch',
        subject: email,
        expiresIn: '7d',
        algorithm: 'RS256'
      };
      return jwt.sign(payload, privateKey, signOption);
    }

    private checkIfPasswordCorrect(user: User, password: string): boolean {
      return password === user.pwhash;
    }

  private isUserVerified(user: User): boolean {
      return user.isVerified;
  }

    // @ts-ignore
    private async getUserFromEmailDB(email: string): Promise<User> {
      let user: User;

      const stream = client.query('SELECT id As id, prename As pn, lastname As ln, email As email, password As pw, isverified As isv From users Where email = $1', [email]);

      for await(const row of stream) {
        if (stream.rows == null) {
          throw new Error('no user with this email found');
        } else if (stream.rows.length !== 1) {
          throw new Error('this email isnt unique in the database');
        } else {
          // tslint:disable-next-line:max-line-length
          user = new User(String(row.get('pn')), String(row.get('ln')), String(row.get('email')), String(row.get('pw')), Boolean(row.get('isv')));
          user.setId(Number(row.get('id')));
          return user;
        }
      }
      throw new Error('no user with this email found');
    }

    async testSql( name: string): Promise<SqlResult> {
        const sqlResult = new SqlResult();

        const stream = client.query('SELECT id As id, prename As pn, lastname As ln, email As email, password As pw, isverified As isv From users Where lastname = $1', [name]);

        for await (const row of stream) {

            if (stream.rows == null) {
                throw new Error('no result found in database');
            }
            // tslint:disable-next-line:max-line-length
            const user = new User(String(row.get('pn')), String(row.get('ln')), String(row.get('email')), String(row.get('pw')), Boolean(row.get('isv')))
            user.setId(Number(row.get('id')));
            // tslint:disable-next-line:max-line-length
            sqlResult.addUser(user);
        }
        return sqlResult;
    }

}



