export class EmailOrderEventServiceCreatorService{
  getEmailOrderEventService(customerEmail:string,serviceTitle: string, date: string, time:string, message:string): string {  //TODO
    return "<body>" +
      "<div align=center style='font-size:24.0pt;font-family:\"Arial Black\",sans-serif'>Welcome to Eventdoo<\div>" +
    "<div align=center style='font-size:14.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>Have you requested a password reset? </p>"+
    "<p>If so perfect! Just click the link below to reset your password.</p>"+
      "<p> For security reasons the link will only be valid for 24h </p> "+
    "<a href=" +  ">reset password</a>"+
      "<p>all the infos have to go somewhere</p>"+
      "<p>Have fun planning your event or finding new opportunities to offer your services</p>"+
    "<p><b><i>Your Eventdoo Team</i></b></p>"+
    "</div>"+
    "<div align=center style='font-size:10.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>In case it wasn't you requesting the password reset, you can simply ignore this email.</p>"+
    "</div>"+
    "</body>";
  }

  getEmailOrderConfirmation(serviceTitle: string, date: string, time:string, message:string): string {  //TODO
    return '<body>'+
      "<div align=center style='font-size:24.0pt;font-family:\"Arial Black\",sans-serif'>Your Eventdoo Order Confirmation<\div>" +
      "<div align=center style='font-size:14.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>Thank you very much for ordering the following Event</p>"+

      "<ref="+ serviceTitle+ ">${serviceTitle}</ref>"+
      "<ref="+ date+ ">Date: ${date}</ref>"+
      "<ref="+ + ">${serviceTitle}</ref>"+
      "<p>Have fun planning your event or finding new opportunities to offer your services</p>"+
      "<p><b><i>Your Eventdoo Team</i></b></p>"+
      "</div>"+
      "<div align=center style='font-size:10.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>In case it wasn't you requesting the password reset, you can simply ignore this email.</p>"+
      "</div>"+
      "</body>";
  }
}

