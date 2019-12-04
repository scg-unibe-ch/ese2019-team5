import nodemailer from 'nodemailer';
import {EmailOrderEventServiceCreatorService} from "./emailOrderEventServiceCreator.service";

const emailService = new EmailOrderEventServiceCreatorService();


/**
 * sends an email to the service provider and the customer, asking the provider to contact the
 * customer within 2 workdays.
 */

export class EmailOrderEventService {


  /**
   *  sends an email using nodemailer to the service provider
   * @param providerEmail the email of the service provider
   * @param customerEmail the email of the customer requesting the service so the provider can contact him
   * @param serviceTitle which service has been requesting
   * @param date on which date the service is requested
   * @param time around what time the service is requested
   * @param message for the provider so the customer can ask for special requests.
   */
  static async sendMailToProvider(providerEmail: string, customerEmail: string, serviceTitle: string, date: string, time: string, message: string) {

    var transporter = nodemailer.createTransport({
      host: 'mail.gmx.net',
      port: 465,
      secure: true,
      auth: {
        user: 'ESEteam5@gmx.de',
        pass: 'WecandoIt19'
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });
    try {
      var mailOptions = {
        from: '"Eventdoo" <ESEteam5@gmx.de>',
        to: providerEmail,
        subject: 'Your Event just got ordered',
        html: emailService.getEmailOrderEventService(customerEmail, serviceTitle, date, time, message)
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent' + info.response);
        }
      });

    } catch (e) {
      console.log(e);
    }
  }

  /**
   * sends an email using nodemailer to the customer
   * @param providerName the name of the service provider so the customer knows from whom an email to expect
   * @param customerEmail the email of the customer requesting the service
   * @param serviceTitle which service has been requested
   * @param date on which date the service is requested
   * @param time around what time the service is requested
   * @param message for the provider so the customer can ask for special requests.
   */
  static async sendMailToCustomer(providerName: string, customerEmail: string, serviceTitle: string, date: string, time: string, message: string) {


    var transporter = nodemailer.createTransport({
      host: 'mail.gmx.net',
      port: 465,
      secure: true,
      auth: {
        user: 'ESEteam5@gmx.de',
        pass: 'WecandoIt19'
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

// send mail with defined transport object
    try {
      //if(time == ''){ //TODO wie genau machen mit time and message?

      var mailOptions = {
        from: '"Eventdoo" <ESEteam5@gmx.de>',
        to: customerEmail,
        subject: 'Your Eventdoo Order Confirmation',
        html: emailService.getEmailOrderConfirmation(providerName, serviceTitle, date, time, message)
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent' + info.response);
        }
      });

    } catch (e) {
      console.log(e);
    }
  }
}













