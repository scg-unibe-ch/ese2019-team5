export class EmailOrderEventServiceCreatorService{
  getEmailOrderEventService(): string {  //TODO
    return "<body>" +
      "<div align=center style='font-size:24.0pt;font-family:\"Arial Black\",sans-serif'>Welcome to Eventdoo<\div>" +
    "<div align=center style='font-size:14.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>Have you requested a password reset? </p>"+
    "<p>If so perfect! Just click the link below to reset your password.</p>"+
      "<p> For security reasons the link will only be valid for 24h </p> "+
    "<a href=" + token + ">reset password</a>"+
      "<p>Have fun planning your event or finding new opportunities to offer your services</p>"+
    "<p><b><i>Your Eventdoo Team</i></b></p>"+
    "</div>"+
    "<div align=center style='font-size:10.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>In case it wasn't you requesting the password reset, you can simply ignore this email.</p>"+
    "</div>"+
    "</body>";
  }

  getEmailOrderConfirmation(): string {  //TODO
    return "<body>" +
      "<div align=center style='font-size:24.0pt;font-family:\"Arial Black\",sans-serif'>Welcome to Eventdoo<\div>" +
      "<div align=center style='font-size:14.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>Have you requested a password reset? </p>"+
      "<p>If so perfect! Just click the link below to reset your password.</p>"+
      "<p> For security reasons the link will only be valid for 24h </p> "+
      "<a href=" + token + ">reset password</a>"+
      "<p>Have fun planning your event or finding new opportunities to offer your services</p>"+
      "<p><b><i>Your Eventdoo Team</i></b></p>"+
      "</div>"+
      "<div align=center style='font-size:10.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>In case it wasn't you requesting the password reset, you can simply ignore this email.</p>"+
      "</div>"+
      "</body>";
  }
}

