import {Client} from 'ts-postgres';
import {SqlResult} from '../models/sqlresult.model';
import {User} from '../models/user.model';
import * as fs from 'fs';

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

    public async getSqlResult(name: string): Promise<SqlResult> {
        return await this.testSql(name);
    }

    public async checkLoginData(email: string, password: string): Promise<User> {
      return new User('t', 't', 't', 't', true);
    }

    public async getUserFromEmail(email: string): Promise<User> {
      await client.connect();
      const user = await this.getUserFromEmailDB(email);
      await client.end();
      return user;
    }

    public async tryLogin(email: string, password: string): Promise<string> {
      let user: User;
      user = await this.getUserFromEmail(email);

      console.log(user);

      if (this.checkIfPasswordCorrect(user, password)) {
        if (this.isUserVerified(user)) {
          return this.generateJWT(email, user.id);
        } else {
          throw Error('To login, please verify your email-address');
        }
      } else {
        throw Error('Invalid email-address or password');
      }
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
      console.log('hallooooo');

      const stream = client.query('SELECT id As id, prename As pn, lastname As ln, email As email, password As pw, isverified As isv From users Where email = $1', [email]);

      for await(const row of stream) {
        if (stream.rows == null) {
          client.end();
          throw new Error('no user with this email found');
        } else if (stream.rows.length !== 1) {
          client.end();
          throw new Error('this email isnt unique in the database');
        } else {
          // tslint:disable-next-line:max-line-length
          user = new User(String(row.get('pn')), String(row.get('ln')), String(row.get('email')), String(row.get('pw')), Boolean(row.get('isv')));
          user.setId(Number(row.get('id')));
          return user;
        }
      }
      client.end();
      throw new Error('no user with this email found');
    }

    async testSql( name: string): Promise<SqlResult> {
        const sqlResult = new SqlResult();
        await client.connect();

        const stream = client.query('SELECT id As id, prename As pn, lastname As ln, email As email, password As pw, isverified As isv From users Where lastname = $1', [name]);

        for await (const row of stream) {
            // console.log(row.get('pn'));
            if (stream.rows == null) {
                throw new Error('no result found in database');
            }
            // tslint:disable-next-line:max-line-length
            const user = new User(String(row.get('pn')), String(row.get('ln')), String(row.get('email')), String(row.get('pw')), Boolean(row.get('isv')))
            user.setId(Number(row.get('id')));
            // tslint:disable-next-line:max-line-length
            sqlResult.addUser(user);
        }
        await client.end();


        // console.log(sqlResult.user[1].toString());
        return sqlResult;
    }

}



