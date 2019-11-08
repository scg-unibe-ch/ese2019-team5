import {Address} from "./address.model";
import {User} from "./user.model";
import {EventServiceBuilder} from "./eventServiceBuilder.model";
import {Categories} from "../categories";
import {Weekdays} from "../weekdays";


//TODO hier noch Foto hinzufügen und wahrscheinlich Builder Pattern brauchen evt noch Service Id für Cyrill zu erstellen
export class EventService {
  private serviceId: number;
  private _providerId:number;
  private _category: string;
  private _title: string;
  private _description: string;
  private _availability: string;
  private _address: Address;
  private _perimeter: string;
  private subtype:string;
  private requirements:string;
  private _capacity: string;
  private _price: string;

  private pictureIds: File[]; // TODO Fotos werden wahrscheinlich als file array übergeben un dann abgespeichert


  constructor(serviceId: number, providerId: number, category: string, title: string, description: string, address: Address, perimeter : string, availability: string, requirements: string, subtype: string, capacity:string, price:string){
    this.serviceId = serviceId;
    this._providerId= providerId;
    this._category = category;
    this._title= title;
    this._description= description;
    this._address= address;
    this._perimeter = perimeter;
    this._availability = availability;
    this.requirements = requirements;
    this.subtype = subtype;
    this._capacity=capacity;
    this._price=price;


    this.pictureIds = []; // provisorisch
  }

  public setServiceId(serviceId: number){
    this.serviceId=serviceId;
  }
  public getServiceId(): number {
    return this.serviceId;
  }


  public setProviderId(providerId: number) {
    this._providerId = providerId;
    return this;
  }
  public getProviderId():number{
    return this._providerId;

  }

  public setCategory(category: string) {
    this._category = category;
    return this;
  }
  public getCategory():string{
    return this._category;

  }

  public setTitle(title: string){
    this._title = title;
    return this;
  }
  public getTitle():string{
    return this._title;

  }

  public setDescription(description: string){
    this._description= description;
    return this;
  }
  public getDescription():string{
    return this._description;

  }

  public setAddress(address: Address){
    this._address = address;
    return this;
  }
  public getAddress():Address{
    return this._address;

  }

  public setPerimeter(perimeter:string){
    this._perimeter= perimeter;
    return this;
  }
  public getPerimeter():string{
    return this._perimeter;

  }

  public setAvailability(availiability: string) {
    this._availability = availiability;
    return this;
  }
  public getAvailability():string{
    return this._availability;

  }

  public setRequirements(requirements:string){
    this.requirements=requirements;
  }
  public getRequirements(): string {
    return this.requirements;
  }

  public setSubtype(subtype:string){
    this.subtype=subtype;
  }
  public getSubtype(): string {
    return this.subtype;
  }

  public setCapacity(capacity:string){
   this._capacity= capacity;
   return this;
  }
  public getCapacity():string{
    return  this._capacity;

  }

  public setPrice(price:string){
    this._price= price;
    return this;
  }
  public getPrice():string{
    return  this._price;

  }
}
