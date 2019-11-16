
import nodemailer from 'nodemailer';
import {EmailOrderEventServiceCreatorService} from "./emailOrderEventServiceCreator.service";
//TODO interface or abstract class because code is used more than once

const emailService = new EmailOrderEventServiceCreatorService();




/**
 * creates an jwt token that is is part of url which is send to user by using {nodemailer}
 * User needs to verify email by clicking on URL to login
 */

export class EmailOrderEventService {

  /**
   * sends a email using nodemailer to a new sign up user
   * @param user that just signed up
   * is called in SignUp controller POST Event listener
   */
  static async sendMailToProvider(providerEmail: string,customerEmail: string,serviceTitle: string,date: string, time:string, message:string) {

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

// send mail with defined transport object
    try{
      var mailOptions = {
        from: '"Eventdoo" <ESEteam5@gmx.de>',
        to: providerEmail,
        subject: 'Your Event just got ordered',
        html: emailService.getEmailOrderEventService(customerEmail,serviceTitle,date,time,message)
      };
  console.log('got before transporter');
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

  static async sendMailToCustomer(customerEmail: string,serviceTitle: string,date: string, time:string, message:string)  {


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

// send mail with defined transport object
    try{
      //if(time == ''){ //TODO wie genau machen mit time and message?

      var mailOptions = {
        from: '"Eventdoo" <ESEteam5@gmx.de>',
        to: customerEmail,
        subject: 'Your Eventdoo Order Confirmation',
        html:emailService.getEmailOrderConfirmation(serviceTitle,date,time,message)
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













