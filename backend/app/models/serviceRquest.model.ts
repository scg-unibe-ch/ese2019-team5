export class ServiceRquest {
  clientId : number;
  serviceId : number;
  serviceTitle : string;
  providerId : number;
  date : string;
  messages : string;


  constructor(clientId: number, serviceId: number, serviceTitle: string, providerId: number, date: string, messages: string) {
    this.clientId = clientId;
    this.serviceId = serviceId;
    this.serviceTitle = serviceTitle;
    this.providerId = providerId;
    this.date = date;
    this.messages = messages;
  }
}
