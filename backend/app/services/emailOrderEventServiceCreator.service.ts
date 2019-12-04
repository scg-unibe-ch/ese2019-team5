/**
 * text for the provider email and the customer email when a customer requested an event service
 */
export class EmailOrderEventServiceCreatorService {
  /**
   * gets the EmailText for the service provider
   * @param customerEmail the email to contact the customer within 2 workdays
   * @param serviceTitle the service that got requested
   * @param date on which the service is requested
   * @param time on which the service is requested
   * @param message of the customer for questions and special requests
   */
  getEmailOrderEventService(customerEmail: string, serviceTitle: string, date: string, time: string, message: string): string {  //TODO
    return `<body><div align=center style='font-size:24.0pt;font-family:"Arial Black",sans-serif'>Your Eventdoo Service got requested <div><div align=center style='font-size:14.0pt;font-family:"Arial",sans-serif'><p>The following eventservice got requested</p><ref=${serviceTitle}>${serviceTitle}</ref>` +
      "<p></p>" +
      `<p>By: <ref=${customerEmail}>${customerEmail}</ref> </p>` +
      `<p>The preferred date would be <ref=${date}>${date}</ref></p>` +
      `<p> <ref=${time}>${time}</ref><br><ref=${message}>${message}</ref></p>` +
      `<p>We kindly ask you to contact via email <ref=${customerEmail}>${customerEmail}</ref> within 2 workdays in order to figure out the details. </p>` +
      "<p>We hope everything goes, well and look forward to inform you next time your service gets requested.</p>" +
      "<p>Hear you soon</p>" +
      "<p><b><i>Your Eventdoo Team</i></b></p>" +
      "</div>" +
      "</div>" +
      "</body>";
  }

  /**
   * gets the email text for the customer
   * @param providerName the service providers name
   * @param serviceTitle title of the service that got requested
   * @param date that on which the service is requested
   * @param time on which the service is requested
   * @param message of the customer for questions and special requests.
   */
  getEmailOrderConfirmation(providerName: string, serviceTitle: string, date: string, time: string, message: string): string {  //TODO
    return `<body><div align=center style='font-size:24.0pt;font-family:"Arial Black",sans-serif'>Your Eventdoo Request Confirmation<div><div align=center style='font-size:14.0pt;font-family:"Arial",sans-serif'><p>Thank you very much for requesting the following event</p><ref=${serviceTitle}>${serviceTitle}</ref>` +
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

}

