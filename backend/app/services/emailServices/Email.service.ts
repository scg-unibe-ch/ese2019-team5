import {User} from "../../models/user.model";
import nodemailer from "nodemailer";

/**
 * This is the parent class for sending mails
 */

export class EmailService {

  /**
   * gets all the individual mail options takes email and emailURL as options
   * should be overwritten in the children class
   * @param email of the receiver
   * @param emailURL if the email has an link in it
   * @return the mailOption as a variable
   */
  static getMailOptions(email: string, emailURL: string): any {
    return '';
  }

  /**
   * creates jwt token and returns it
   * @param payload of the token
   * @param email
   */
  static makeToken(payload: any, email: string): string {
    return '';
  }

  /**
   * gets the transporter that is needed
   * uses {@link nodemailer}
   * @return the needed transporter for the email
   */
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

  /**
   * sends a mail to a given user
   * uses {@link nodemailer}
   * @param user
   */
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

