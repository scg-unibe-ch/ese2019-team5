import {EmailService} from "./Email.service";
import {EmailReportServiceCreatorService} from "./EmailReportServiceCreator.service";


export class EmailReportServiceServices extends EmailService {

  /**
   * overrides the parent's method
   * gets the mail Options to send email to the Eventdoo team
   * @param userIdParam Id of the user that reported an service
   * @param serviceIdParam Id of the service that seemed inappropriate
   * @return the mail options
   */
  static getMailOptions(userIdParam: string, serviceIdParam:string): any {
    let userId: number= parseInt(userIdParam);
    let serviceId: number= parseInt(serviceIdParam);

    var mailOptions = {
      from: '"Eventdoo" <ESEteam5@gmx.de>',
      to: 'ESEteam5@gmx.de',
      subject: 'Reported Service',
      html: EmailReportServiceCreatorService.getEmailReportService(serviceId,userId)
    };
    return mailOptions;
  }

  /**
   * sends an email using the transporter of the parent class (using nodemailer)
   * @param serviceId that was reported inappropriate
   * @param userThatReportedId Id of the user that reported the service
   */
  static sendReportMail(serviceId: string, userThatReportedId: string)
{
  try {
    let transporter=super.getTransporter();

    transporter.sendMail(this.getMailOptions(serviceId,userThatReportedId), function (err:any, info:any) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent' + info.response);
      }
    })

  }catch (e) {
    console.log(e);
  }
}
}














