export class EmailReportServiceCreatorService {
  static getEmailReportService(serviceId:number, userId:number): string {
    return "<body>" +
      "<div align=center style='font-size:24.0pt;font-family:\"Arial Black\",sans-serif'>Reported service<\div>" +
      "<div align=center style='font-size:14.0pt;font-family:\"Arial\",sans-serif'>" +
      "<p>The following service has been reported as inappropriate </p>" +
      `<p>Event service with id:<ref=${serviceId}> ${serviceId}</ref> has been reported by the user with the id: <ref=${userId}>${userId}</ref></p>` +
      "<p><b><i>Your Eventdoo Team</i></b></p>" +
      "</div>" +

      "</body>";
  }
}

