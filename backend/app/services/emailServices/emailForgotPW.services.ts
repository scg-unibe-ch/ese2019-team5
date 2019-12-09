/**
 *  This class creates an jwt token {@link jwt} that is is part of url which is send to user by using {@link nodemailer}
 * User needs to verify email by clicking on URL to login
 * This class extends the {@link EmailService}
 */

import * as fs from 'fs';
import {User} from '../../models/user.model';
import * as jwt from 'jsonwebtoken';
import {EmailForgotPWCreatorService} from "./emailForgotPWCreator.service";
import {EmailService} from "./Email.service";

const privateKey = fs.readFileSync('./app/services/privateForgotPWKey.key', 'utf8');


export class EmailForgotPWServices extends EmailService {

  /**
   * sends reset Password mail to the user
   * by calling the parent method
   * @param user to which the email should be sent
   */
  public static async sendMailToUser(user: User) {
    super.sendMailToUser(user);
  }


  /**
   * gets the mail options and overrides the parent's class method
   * @param email to whom the mail is sent
   * @param emailURL URL that needs to be included in the email.
   */
  static getMailOptions(email: string, emailURL: string): any {
    var mailOptions = {
      from: '"Eventdoo" <ESEteam5@gmx.de>',
      to: email,
      subject: 'Password Reset',
      html: EmailForgotPWCreatorService.getEmailForgotPWText(emailURL)
    };
    return mailOptions;
  }


  /**
   * overrides the parent's method
   * creates a jwt token for the email using payload and email
   * @param payload that will be part of the jwt token
   * @param email needed vor subject and audience
   * @return emailURL that will be sent to user by sendMailToUser Method
   * is called from sendMailToUser
   * @link jwt is used here to create a token
   */
  static makeToken(payload: any, email: string): string {
    var signOptions = {
      issuer: 'Eventdoo',
      subject: email,
      audience: email,
      expiresIn: '24h',
      algorithm: 'RS256'
    };

    var emailToken = jwt.sign(payload, privateKey, signOptions);
    const emailUrl = `http://localhost:4200/start/login/resetPassword/${emailToken}`;
    return emailUrl;
  }

}













