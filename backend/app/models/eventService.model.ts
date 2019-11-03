import {Address} from "./address.model";
import {User} from "./user.model";
import {EventServiceBuilder} from "./eventServiceBuilder.model";
import {Categories} from "../categories";
import {Weekdays} from "../weekdays";


//TODO hier noch Foto hinzufügen und wahrscheinlich Builder Pattern brauchen evt noch Service Id für Cyrill zu erstellen
export class EventService {
   private serviceId: number= -1;
  subtype:string= '';
  private _providerId:number;
  private _category: Categories;
  private _title: string;
  private _description: string;
  private _availability: Weekdays[];
  private _address: Address;
  private _perimeter: string;

  constructor(providerId: number,category: Categories, title: string,description: string,availability : Weekdays[],address: Address, perimeter : string){
    this._providerId= providerId;
    this._category = category;
    this._title= title;
    this._description= description;
    this._availability = availability;
    this._address= address;
    this._perimeter = perimeter;

  }
  public setProviderId(providerId: number) {
    this._providerId = providerId;
    return this;
  }

  public getProviderId():number{
    return this._providerId;

  }


  public setTitle(title: string){
    this._title = title;
    return this;
  }

  public getTitle():string{
    return this._title;

  }

  public setCategory(category: Categories) {
    this._category = category;
    return this;
  }
  public getCategory():Categories{
    return this._category;

  }


  public setDescription(description: string){
    this._description= description;
    return this;
  }

  public getDescription():string{
    return this._description;

  }

  public setAvailability(availiability: Weekdays[]) {
    this._availability = availiability;
    return this;
  }
  public getAvailability():Weekdays[]{
    return this._availability;

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

  public setSubtype(subtype:string){
    this.subtype=subtype;
  }

  public setServiceId(serviceId: number){
    this.serviceId=serviceId;
  }



}
