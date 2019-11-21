import {Address} from "./address.model";
import {User} from "./user.model";
import {EventServiceBuilder} from "./eventServiceBuilder.model";
import {Categories} from "../categories";



//TODO hier noch Foto hinzufügen und wahrscheinlich Builder Pattern brauchen evt noch Service Id für Cyrill zu erstellen
export class EventService {
  private serviceId: number;
  private _providerId:number;
  private _category: string;
  private _title: string;
  private _description: string;
  private _availability: string;
  private _address: Address;
  private _perimeter: number;
  private _subtype:string;
  private _requirements:string;
  private _capacity: number;
  private _price: number;
  private _image:string;


  constructor(serviceId: number, providerId: number, category: string, title: string, description: string, address: Address, perimeter : number, availability: string, requirements: string, subtype: string, capacity:number, price:number,image:string){
    this.serviceId = serviceId;
    this._providerId= providerId;
    this._category = category;
    this._title= title;
    this._description= description;
    this._address= address;
    this._perimeter = perimeter;
    this._availability = availability;
    this._requirements = requirements;
    this._subtype = subtype;
    this._capacity=capacity;
    this._price=price;
    this._image=image;
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

  public setPerimeter(perimeter:number){
    this._perimeter= perimeter;
    return this;
  }
  public getPerimeter():number{
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
    this._requirements=requirements;
  }
  public getRequirements(): string {
    return this._requirements;
  }

  public setSubtype(subtype:string){
    this._subtype=subtype;
  }
  public getSubtype(): string {
    return this._subtype;
  }

  public setCapacity(capacity:number){
   this._capacity= capacity;
   return this;
  }
  public getCapacity():number{
    return  this._capacity;

  }

  public setPrice(price:number){
    this._price= price;
    return this;
  }
  public getPrice():number{
    return  this._price;

  }

  public setImage(image:string){
    this._image=image;
    return this;
  }


  public getImage():string{

    return this._image;
  }


  public toSimplification():any{
    return{
      'serviceId':this.getServiceId(),
      'providerId':this.getProviderId(),
      'category':this.getCategory(),
      'title':this.getTitle(),
      'description': this.getDescription(),
      'address':this.getAddress(),
      'perimeter': this.getPerimeter(),
      'availability': this.getAvailability(),
      'requirements': this.getRequirements(),
      'subtype':this.getSubtype(),
      'capacity':this.getCapacity(),
      'price':this.getPrice(),
      'image':this.getImage()

    }


  }
}
