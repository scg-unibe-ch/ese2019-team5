import * as fs from 'fs';
import {User} from '../models/user.model';
import {EmailCreatorService} from "./emailCreator.service";
import * as jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const privateKey = fs.readFileSync('./app/services/private.key', 'utf8');
const emailService = new EmailCreatorService();
 let token: string;

/**
 * creates a jwt token for the email using payload and email
 * @param payload that will be part of the jwt token
 * @param email needed vor subject and audience
 * @return emailURL that will be sent to user by sendMailToNewUser Method
 * is called from sendMailToNewUser
 */
function makeToken(payload: any, email: string) {
  var signOptions = {
    issuer: 'Eventdoo',
     subject: email,
    audience: email,
    expiresIn: '24h',
    algorithm: 'RS256'};
  var emailToken = jwt.sign(payload, privateKey, signOptions);
  const emailUrl = `http://localhost:3000/signup/confirmation/${emailToken}`;
  token = emailToken;
  return emailUrl;
}

/**
 * creates an jwt token that is is part of url which is send to user by using {nodemailer}
 * User needs to verify email by clicking on URL to login
 */

export class EmailVerificationServices {

  /**
   * sends a email using nodemailer to a new sign up user
   * @param user that just signed up
   * is called in SignUp controller POST Event listener
   */
  static async sendMailToNewUser(user: User) {
    let payload = {
      name: user.firstname,
      surname: user.lastname,
      email: user.email,
    }
    var transporter = nodemailer.createTransport({
      host: 'mail.gmx.net',
      port: 465,
      secure: true,
      auth: {
        user: 'ESEteam5@gmx.de',
        pass: 'WecandoIt19'
      },
      tls: { // because we are not on that host currently.... just those 2 lines
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });
    const emailURL = makeToken(payload, user.email);
// send mail with defined transport object
    try{
      var mailOptions = {
        from: '"Eventdoo" <ESEteam5@gmx.de>',
        to: user.email,
        subject: 'E-Mail Verification for your Eventdoo Account',
        html: emailService.getEmailText(emailURL)
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent' + info.response);
        }
      });

    }catch (e) {
      console.log(e);
    }
  }

}













