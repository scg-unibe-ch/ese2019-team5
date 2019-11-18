import {User} from "../models/user.model";
import nodemailer from "nodemailer";



export abstract class EmailService {

  //abstract makeToken(payload: any, email: string): string;
protected static makeToken(payload: any, email: string):string{
  return '';
};
  protected static getMailOptions():any{};

  public static async sendMailToUser(user: User) {

    let payload = {
      name: user.getFirstname(),
      surname: user.getLastname(),
      email: user.getEmail(),
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

     const emailURL= this.makeToken(payload, user.getEmail());


    try{
      var mailOptions = this.getMailOptions();

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

