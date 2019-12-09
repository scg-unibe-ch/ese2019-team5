/**
 * This class is used to create a service request. Since request already exists it's called service request because it is a requested
 * service but not with all the same attribute as the event service.
 */


export class ServiceRequest {
  private customerId: number;
  private serviceId: number;
  private serviceTitle: string;
  private providerId: number;
  private date: string;
  private message: string;
  private category: string;

  /**
   * constructor for a servicerequest
   * @param customerId Id of the customer requesting the service
   * @param serviceId Id of the service requested
   * @param serviceTitle Title of the service
   * @param category of the service
   * @param providerId Id of the service provider
   * @param date when the service is supposed to be
   * @param message for the service provider form the customer
   */
  constructor(customerId: number, serviceId: number, serviceTitle: string,category: string, providerId: number, date: string, message: string) {
    this.customerId = customerId;
    this.serviceId = serviceId;
    this.serviceTitle = serviceTitle;
    this.category = category;
    this.providerId = providerId;
    this.date = date;
    this.message = message;
  }

  /**
   * sets customer Id
   * @param customerId Id of the customer requesting the service
   */
  public setCustomerId(customerId: number) {
    this.customerId = customerId;
    return this;
  }

  /**
   * @return customerId
   */
  public getCustomerId(): number {
    return this.customerId;
  }

  /**
   * sets the serviceId
   * @param serviceId
   */
  public setServiceId(serviceId: number) {
    this.serviceId = serviceId;
    return this;
  }

  /**
   * @return serviceId
   */
  public getServiceId(): number {
    return this.serviceId;
  }

  /**
   * sets the title of the service
   * @param title
   */
  public setServiceTitle(title: string) {
    this.serviceTitle = title;
    return this;
  }

  /**
   * @return serviceTitle
   */
  public getServiceTitle(): string {
    return this.serviceTitle;
  }

  /**
   * sets the category of the service
   * @param title
   */
  public setCategory(category: string) {
    this.category = category;
    return this;
  }

  /**
   * @return category
   */
  public getCategory(): string {
    return this.category;
  }

  /**
   * sets the id of ther service provider
   * @param providerId
   */
  public setProviderId(providerId: number) {
    this.providerId = providerId;
    return this;
  }

  /**
   * @return providerId
   */
  public getProviderId(): number {
    return this.providerId;
  }

  /**
   * sets the date, when the service is needed and should take place
   * @param date
   */
  public setDate(date: string) {
    this.date = date;
    return this;
  }

  /**
   * @return date
   */
  public getDate(): string {
    return this.date;
  }

  /**
   * sets the message coming from the customer addressed to th provider
   * @param message
   */
  public setMessage(message: string) {
    this.message = message;
    return this;
  }

  /**
   * @return message
   */
  public getMessage(): string {
    return this.message;
  }

  /**
   * simplifies a service request in to the smaller parts
   * is used when sending service requests to the front
   */
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
