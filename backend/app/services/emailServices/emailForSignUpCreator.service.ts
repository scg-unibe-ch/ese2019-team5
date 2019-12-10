/**
 * This class is the email text for a user that has just signed up
 * asking him to verify his email address
 */


export class EmailForSignUpCreatorService{
  static getEmailSignUpText(token: string): string {
    return "<body>" +
      "<div align=center style='font-size:24.0pt;font-family:\"Arial Black\",sans-serif'>Welcome to Eventdoo<\div>" +
    "<div align=center style='font-size:14.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>We are pleased to welcome you as a new Eventdoo user.</p>"+
    "<p>In order to use all our services, we kindly ask you to verify your email-address.</p>"+
    "<a href='" +token +"' target='_blank'>verify email</a>"+
      "<p>Have fun planning your event or finding new oppurtunities to offer your services.</p>"+
    "<p><b><i>Your Eventdoo Team</i></b></p>"+
    "</div>"+
    "<div align=center style='font-size:10.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>In case you haven't signed up for our service, you can simply ignore this email.</p>"+
    "</div>"+
    "</body>";
  }
}


