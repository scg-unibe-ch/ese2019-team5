/**
 * This class is theb uilder for a service request
 */
import {Address} from "./address.model";
import {EventService} from "./eventService.model";
import {ServiceRequest} from "./serviceRequest.model";

const mockAddress: Address = new Address('', '', 1234, '');


export class ServiceRequestBuilder {
  private _customerId:number;
  private _serviceId: number;
  private _serviceTitle: string;
  private _category: string;
  private _providerId: number;
  private _date: string;
  private _message: string;


  /**
   * constructor for a service request with default values
   */
  constructor() {
    this._customerId=-1;
    this._serviceId = -1;
    this._serviceTitle = '';
    this._category = '';
    this._providerId = -1;
    this._date= '';
    this._message= '';
     }

  /**
   * creates a new ServiceRequestBuilder
   * @return new ServiceRequestBuilder
   */
  public static serviceRequest(): ServiceRequestBuilder{
    return new ServiceRequestBuilder();
  }

  /**
   * sets customer Id
   * @param customerId Id of the customer requesting the service
   */
  public setCustomerId(customerId: number) {
    this._customerId = customerId;
    return this;
  }

  /**
   * sets the serviceId
   * @param serviceId
   */
  public setServiceId(serviceId: number): ServiceRequestBuilder{
    this._serviceId = serviceId;
    return this;
  }

  /**
   * sets the title of the service
   * @param title
   */
  public setServiceTitle(title: string) {
    this._serviceTitle = title;
    return this;
  }

  /**
   * sets the id of ther service provider
   * @param providerId
   */
  public setProviderId(providerId: number): ServiceRequestBuilder {
    this._providerId = providerId;
    return this;
  }

  /**
   * sets the category of the service
   * @param category
   */
  public setCategory(category: string): ServiceRequestBuilder {
    this._category = category;
    return this;
  }

  /**
   * sets the date, when the service is needed and should take place
   * @param date
   */
  public setDate(date: string) {
    this._date = date;
    return this;
  }

  /**
   * sets the message coming from the customer addressed to th provider
   * @param message
   */
  public setMessage(message: string) {
    this._message = message;
    return this;
  }

  /**
   * builds a service requests with all the given parameters
   * @return newly created service request
   */
  public build(): ServiceRequest {
    let serviceRequest: ServiceRequest = new ServiceRequest(this._customerId,this._serviceId,this._serviceTitle, this._category, this._providerId, this._date,this._message);
    return serviceRequest;
  }


}
