export class EmailOrderEventServiceCreatorService {
  getEmailOrderEventService(customerEmail: string, serviceTitle: string, date: string, time: string, message: string): string {  //TODO
    return `<body><div align=center style='font-size:24.0pt;font-family:"Arial Black",sans-serif'>Your Eventdoo Service got ordered <div><div align=center style='font-size:14.0pt;font-family:"Arial",sans-serif'><p>The following eventservice got orderd</p><ref=${serviceTitle}>${serviceTitle}</ref>` +
      "<p></p>" +
      `<p>By: <ref=${customerEmail}>${customerEmail}</ref> </p>` +
      `<p>The preferred date would be <ref=${date}>${date}</ref></p>` +
      `<p> <ref=${time}>${time}</ref><br><ref=${message}>${message}</ref></p>` +
      `<p>We kindly ask you to contact via email <ref=${customerEmail}>${customerEmail}</ref> within 2 days in order to figure out the details. </p>` +
      "<p>We hope everything goes, well and look forward to inform you next time your service gets orders.</p>" +
      "<p>Hear you soon</p>" +
      "<p><b><i>Your Eventdoo Team</i></b></p>" +
      "</div>" +
      "</div>" +
      "</body>";
  }

  getEmailOrderConfirmation(providerName: string, serviceTitle: string, date: string, time: string, message: string): string {  //TODO
    return `<body><div align=center style='font-size:24.0pt;font-family:"Arial Black",sans-serif'>Your Eventdoo Order Confirmation<div><div align=center style='font-size:14.0pt;font-family:"Arial",sans-serif'><p>Thank you very much for ordering the following event</p><ref=${serviceTitle}>${serviceTitle}</ref>` +
      "<p></p>" +
      `<p>Your prefered date: <ref=${date}>${date}</ref><br><ref=${time}>${time}</ref> <br> <ref=${message}>${message}</ref></p>` +
      `<p>The serviceprovider <ref=${providerName}>${providerName}</ref> will contact you via email shortly to figure out all details. </p>` +
      `<p>In case you haven't heard from <ref=${providerName}>${providerName}</ref> in 2 days, please let us know.</p>` +
      "<p>We hope your event will be perfect and that we could make the preparations a bit easier. We would be pleased if we could count you to our users for your next event</p>" +
      "<p>All the best</p>" +
      "<p><b><i>Your Eventdoo Team</i></b></p>" +
      "</div>" +
      "</div>" +
      "</body>";
  }


  /*
    "<div align=center style='font-size:24.0pt;font-family:\"Arial Black\",sans-serif'>Your Eventdoo Order Confirmation<\div>" +
    "<div align=center style='font-size:14.0pt;font-family:\"Arial\",sans-serif'>"+
    "<p>Thank you very much for ordering the following Event</p>"+

    "<ref="+ serviceTitle+ ">#{serviceTitle}</ref>"+

    "<script>"+ function printServicetitle():string{ return serviceTitle;} + document.getElementById("body").innerHTML= printServicetitle()+
      "</script>"+
      "<ref="+ + ">${serviceTitle}</ref>"+
      "<p>Have fun planning your event or finding new opportunities to offer your services</p>"+
      "<p><b><i>Your Eventdoo Team</i></b></p>"+
      "</div>"+
      "<div align=center style='font-size:10.0pt;font-family:\"Arial\",sans-serif'>"+
      "<p>In case it wasn't you requesting the password reset, you can simply ignore this email.</p>"+
      "</div>"+
      "</body>";*/
}

