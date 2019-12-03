import {User} from "../models/user.model";
import nodemailer from "nodemailer";


export class EmailService {


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

