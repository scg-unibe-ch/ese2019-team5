export class ServiceRequest {
  private _clientId : number;
  private _serviceId : number;
  private _serviceTitle : string;
  private _providerId : number;
  private _date : string;
  private _messages : string;
  private _serviceCategory  : string;


  constructor(clientId: number, serviceId: number, serviceTitle: string, providerId: number, date: string, messages: string, serviceCategory: string) {
    this._clientId = clientId;
    this._serviceId = serviceId;
    this._serviceTitle = serviceTitle;
    this._providerId = providerId;
    this._date = date;
    this._messages = messages;
    this._serviceCategory = serviceCategory;
  }

  get clientId(): number {
    return this._clientId;
  }

  get serviceId(): number {
    return this._serviceId;
  }

  get serviceTitle(): string {
    return this._serviceTitle;
  }

  get providerId(): number {
    return this._providerId;
  }

  get date(): string {
    return this._date;
  }

  get messages(): string {
    return this._messages;
  }

  get serviceCategory(): string {
    return this._serviceCategory;
  }
}
