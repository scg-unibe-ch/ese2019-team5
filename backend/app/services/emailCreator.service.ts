export class EmailCreatorService{
  getEmailText(token: string): string {
    return "<body>" +
      "<div align=center style='font-size:24.0pt;font-family:\"Arial Black\",sans-serif'>Willkommen zu Eventdoo<\div>" +
    "<div align=center style='font-size:14.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>Vielen Dank, dass Sie Eventdoo nutzen möchten.</p>"+
    "<p>Um unseren Service in seinem vollen Umfang nutzen zu können, bitten wir Sie noch Ihre Email-Address zu bestätigen.</p>"+
    "<a href=" + token + ">Email bestätigen</a>"+
      "<p>Wir wünschen Ihnen viel Spass beim Planen Ihres Eventes</p>"+
    "<p><b><i>Ihr Eventdoo Team</i></b></p>"+
    "</div>"+
    "<div align=center style='font-size:10.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>Falls Sie sich nicht für unseren Service angemeldet haben, können Sie diese Mail einfach ignorieren.</p>"+
    "</div>"+
    "</body>";
  }
}

