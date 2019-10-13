// TODO wo gehört das hin
// noch keine Ahnung aber das brauchts für E-Mail verifikation

import * as fs from 'fs';
import {User} from '../Server (GC)/user';
// import jwt, {sign, verify, decode} from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// const privateKey = fs.readFileSync('./private.key', 'utf8');
const privateKey = fs.readFileSync('./app/Server (GC)/private.key', 'utf8');
const publicKey = fs.readFileSync('./app/Server (GC)/public.key', 'utf8');
 let token: string;

function makeToken(payload: any, email: string) {
  console.log('in make token');
  var signOptions = {
    issuer: 'Eventdoo',
     subject: email,
    audience: email,
    expiresIn: '24h',
    algorithm: 'RS256'};
  var emailToken = jwt.sign(payload, privateKey, signOptions);
  (console.log('make token was done'));
  const emailUrl = `http://localhost:3000/user/confirmation${emailToken}`;
  token = emailToken;

  return emailUrl;
}


export class EmailVerification {


  static async sendMailToNewUser (user: User) {
    // try {
    let payload = {
      name: user.name,
      surname: user.surname,
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
    console.log('sendMail before token');
    const emailURL = makeToken(payload, user.email);

// send mail with defined transport object
    // const info = await transporter.sendMail({ // new version below
    var mailOptions = {
      from: '"Eventdoo" <ESEteam5@gmx.de>',
      to: user.email,
      subject: 'E-Mail Verification for your Eventdoo Account',
     // text: 'Hello world?' + emailURL, // plain text body
      html: `Please verify your e-mail address: <a href="${emailURL}">${emailURL}</a>` // html body//TODO noch schön anpassen
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent' + info.response);
      }
    });

  }
// gibt das wirklich boolean
// let legitimate: boolean = jwt.verify(token, publicKEY, verifyOptions);


  verify(token: string) {
    return jwt.verify(token, publicKey, {algorithms: ['RS256']});
  }

// no error catching here

  decode(token: string) {
    jwt.decode(token, {complete: true});
  }
}

/*    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


  } catch (Error) { // ersetzt das unten dran
    console.error();
  }
}*/

// sendMailToNewUser(user.email).catch(console.error);










/*


const verifyOptions = {
  issuer: sender,
  subject: subject,
  audience: audience,
  expiresIn: '24h',
  algorithm: ['RS256']
};
*!/
*/

