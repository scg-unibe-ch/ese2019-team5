// TODO wo gehört das hin
// noch keine Ahnung aber das brauchts für E-Mail verifikation

import * as fs from 'fs';
import {Token} from 'nodemailer/lib/xoauth2';
import jwt, {sign, verify, decode} from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const privateKey = fs.readFileSync('./private.key', 'utf8');
const publicKey = fs.readFileSync('./public.key', 'utf8');
 let token: string;

function makeToken(email: string):string {

    const signOptions = {
      expiresIn: '24h',
      algorithm: 'RS256'};
    let emailToken: any;
    emailToken = jwt.sign(email, privateKey,
      signOptions);
    const emailUrl = `http://localhost:3000/confirmation/${emailToken}`;
    token = emailToken;

    return emailUrl;
  }


export class EmailVerification {
// gibt das wirklich boolean
// let legitimate: boolean = jwt.verify(token, publicKEY, verifyOptions);

 /* let payload: { data1: string } = {
    data1: 'data 1',
  };*/

// und nun das ganze als Funktionen glaubs
/*  sign(payload, $Options)=> {
  // Signing Options  kann das const sein?? Wieso auch bei token wieder ein Problem!!auch wenn sich audience oder so ändern könnte?
 let signOptions = {
    issuer: $Options.issuer,
    subject: $Options.subject,
    audience: $Options.audience,
    expiresIn: '24h',
    algorithm: 'RS256'
  };
  return
  jwt.sign(payload, privateKey, { algorithm: ['RS256'] })  ;
*/

 verify(token: string){
    return jwt.verify(token, publicKey, {algorithms: ['RS256']}); }
// no error catching here

 decode (token: string) {
    jwt.decode(token, {complete: true});
}





static async sendMailToNewUser(email: string) {

  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.gmx.net',
      port: 993,
      secure: false,
      auth: {
        user: 'ESEteam5@gmx.de',
        pass: 'WecandoIt19'
      },
      tls: { // because we are not on that host currently.... just those 2 lines
        rejectUnauthorized: false
      }
    });
   const emailURL = makeToken(email);


// send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"ESETeam5" <ESEteam5@gmx.de>', // sender address
      to: 'will123459@gmail.com', // email, // list of receivers
      subject: 'E-Mail Verification for your ESETeam5 Account',
      text: 'Hello world?', // plain text body
      html: '<b>Please verify your e-mail address</b>' // html body//TODO noch schön anpassen
    });



    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


  } catch (Error) { // ersetzt das unten dran
    console.error();
  }
}

// sendMailToNewUser(user.email).catch(console.error);


}





/*const sender = 'ESETeam5';
const subject = 'some@user.com';
const audience = 'http://mysoftcorp.in'; // TODO was sind die drei hier genau??*/

/*
// Signing Options  kann das const sein?? Wieso auch bei token wieder ein Problem!!auch wenn sich audience oder so ändern könnte?
const signOptions = {
  issuer: sender,
  subject: subject,
  audience: audience,
  expiresIn: '24h',
  algorithm: 'RS256'
};



const verifyOptions = {
  issuer: sender,
  subject: subject,
  audience: audience,
  expiresIn: '24h',
  algorithm: ['RS256']
};
*/



