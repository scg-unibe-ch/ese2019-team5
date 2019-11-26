import {User} from "../models/user.model";
import nodemailer from "nodemailer";
import {default as jwt, verify} from "jsonwebtoken";
import * as fs from "fs"
import {EmailForgotPWCreatorService} from "./emailForgotPWCreator.service";
import {EmailForSignUpCreatorService} from "./emailForSignUpCreator.service";


export class EmailService {

  //abstract makeToken(payload: any, email: string): string;
  /* protected static makeToken(payload: any, email: string, type: string): string {
     var signOptions = {
       issuer: 'Eventdoo',
       subject: email,
       audience: email,
       expiresIn: '24h',
       algorithm: 'RS256'
     };
     if (type.localeCompare('VerifyUser')) {
       const privateKey = fs.readFileSync('./app/services/private.key', 'utf8');
       var emailToken = jwt.sign(payload, privateKey, signOptions);
       const emailUrl = `http://localhost:4200/start/login/resetPassword/${emailToken}`;
       //token = emailToken;
       return emailUrl;
     } else {
       const privateKey = fs.readFileSync('./app/services/privateForgotPWKey.key', 'utf8');
       var emailToken = jwt.sign(payload, privateKey, signOptions);
       const emailUrl = `http://localhost:4200/start/signup/confirmation/${emailToken}`;
       return emailUrl;

     }

   };*/

  /*protected static getMailOptions(email: string, type: string, emailURL: string): any
  {
    console.log(type);
    if (type.localeCompare('VerifyUser')) {
      var mailOptions = {
        from: '"Eventdoo" <ESEteam5@gmx.de>',
        to: email,
        subject: 'E-Mail Verification for your Eventdoo Account',
        html: EmailForSignUpCreatorService.getEmailSignUpText(emailURL)
      };
  return mailOptions;
    } else {
      var mailOptions = {
        from: '"Eventdoo" <ESEteam5@gmx.de>',
        to: email,
        subject: 'Password Reset',
        html: EmailForgotPWCreatorService.getEmailForgotPWText(emailURL)
      }
      return mailOptions;
    }


  };*/

  static getMailOptions(email: string, emailURL: string): any {
    return '';
  }

  static makeToken(payload: any, email: string): string {
    return '';
  }

  static getTransporter(): any {
    let  transporter = nodemailer.createTransport({
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
      }
    );
    return transporter;
  }

  public static async sendMailToUser(user: User) {

    let payload = {
      name: user.getFirstname(),
      surname: user.getLastname(),
      email: user.getEmail(),
    }
   /* var transporter = nodemailer.createTransport({
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
    });*/
    let transporter = this.getTransporter();
    const emailURL = this.makeToken(payload, user.getEmail());

    try {
      var mailOptions = this.getMailOptions(user.getEmail(), emailURL);

      transporter.sendMail(mailOptions, function (error: any, info:any) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent' + info.response);
        }
      });

    } catch (e) {
      console.log(e);
    }
  }



}

