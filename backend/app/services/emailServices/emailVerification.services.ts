import * as fs from 'fs';
import {User} from '../../models/user.model';
import {EmailForSignUpCreatorService} from "./emailForSignUpCreator.service";
import * as jwt from 'jsonwebtoken';
import {EmailService} from "./Email.service";


const privateKey = fs.readFileSync('./app/services/private.key', 'utf8');

export class EmailVerificationServices extends EmailService {

  /**
   * sends Mail to user by calling the parent's method (using nodemailer)
   * @param user to which the email should be sent
   */
  public static async sendMailToUser(user: User) {
    super.sendMailToUser(user);
  }

  /**
   * gets the MailOptions including the mailtext
   * @param email to whom the mail should be sent
   * @param emailURL for the user to verify his email address
   * @return the mailOptions
   */
  static getMailOptions(email: string, emailURL: string): any {
    var mailOptions = {
      from: '"Eventdoo" <ESEteam5@gmx.de>',
      to: email,
      subject: 'E-Mail Verification for your Eventdoo Account',
      html: EmailForSignUpCreatorService.getEmailSignUpText(emailURL)
    };
    return mailOptions;
  }

  /**
   * makes the jwt token so we can identify the user
   * @param payload for the token
   * @param email of the revceiver of the emial
   * @return a link which will be used in the email
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
    const emailUrl = `http://localhost:4200/start/signup/confirmation/${emailToken}`;
    return emailUrl;
  }
}













