export class ServiceRequest {
  private customerId: number;
  private serviceId: number;
  private serviceTitle: string;
  private providerId: number;
  private date: string;
  private message: string;
  private category: string;


  constructor(customerId: number, serviceId: number, serviceTitle: string,category: string, providerId: number, date: string, message: string) {
    this.customerId = customerId;
    this.serviceId = serviceId;
    this.serviceTitle = serviceTitle;
    this.category = category;
    this.providerId = providerId;
    this.date = date;
    this.message = message;

  }

  public setCustomerId(customerId: number) {
    this.customerId = customerId;
    return this;
  }

  public getCustomerId(): number {
    return this.customerId;
  }

  public setServiceId(serviceId: number) {
    this.serviceId = serviceId;
    return this;
  }

  public getServiceId(): number {
    return this.serviceId;
  }

  public setServiceTitle(title: string) {
    this.serviceTitle = title;
    return this;
  }

  public getServiceTitle(): string {
    return this.serviceTitle;

  }

  public setCategory(category: string) {
    this.category = category;
    return this;
  }

  public getCategory(): string {
    return this.category;

  }

  public setProviderId(providerId: number) {
    this.providerId = providerId;
    return this;
  }

  public getProviderId(): number {
    return this.providerId;

  }

  public setDate(date: string) {
    this.date = date;
    return this;
  }

  public getDate(): string {
    return this.date;

  }

  public setMessage(message: string) {
    this.message = message;
    return this;
  }

  public getMessage(): string {
    return this.message;

  }


  public toSimplification(): any {
    return {
      'customerId': this.getCustomerId(),
      'serviceId': this.getServiceId(),
      'serviceTitle': this.getServiceTitle(),
      'category': this.getCategory(),
      'providerId': this.getProviderId(),
      'date': this.getDate(),
      'message': this.getMessage()
    }
  }
}
