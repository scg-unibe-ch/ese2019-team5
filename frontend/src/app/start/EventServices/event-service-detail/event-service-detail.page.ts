import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../../../../../../backend/app/models/eventService.model";
import {FormBuilder, Validators} from "@angular/forms";
import {ToastController} from "@ionic/angular";
import {AuthService} from "../../../AuthService/auth.service";
import {EventServiceJson} from "../../userprofile/EventServiceJson";

import {Observable, Subject, Subscription} from "rxjs";
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-event-service-detail',
  templateUrl: './event-service-detail.page.html',
  styleUrls: ['./event-service-detail.page.scss'],
})
export class EventServiceDetailPage implements OnInit {
  public devWidth = this.platform.width();

  private serviceId: string;
  private isInputing: boolean = false;
  private isEditing: boolean = false;
  private hasReported: boolean = false;
  private hasSentOfferInquiry: boolean = false;

  private category:string;
  private title:string;
  private description:string;
  private city:string;
  private displayCity:string;
  private zip:string;
  private housenumber:string;
  private street:string;
  private perimeter:string;
  private displayPerimeter:string;
  private availability:string;
  private displayAvailability: string;
  private requirements:string;
  private reqDisplay: string;
  private subtype:string;
  private capacity:string;
  private price:string;
  private image:string;
  private providerId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toast: ToastController,
    private auth: AuthService,
    private toastController: ToastController,
    private platform: Platform
  ) { }

  orderInfoForm = this.formBuilder.group({
    dateInput: ['', [Validators.required]],
    messageInput: ['', [Validators.required]],
    timeInput: ['', [Validators.required]],
  });

  updateInfoForm = this.formBuilder.group({
    updateTitle: [this.title, [Validators.required, Validators.minLength(3)]],
    updateDescription: [this.description, [Validators.required, Validators.minLength(3)]],
    updatePrice: [this.price, [Validators.required, Validators.pattern('[0-9]+(([.][0-9]{1,2})?){1}')]],
    updateAvailability: [this.availability, [Validators.required, Validators.min(1)]],
    updatePerimeter: [this.perimeter, [Validators.required, Validators.pattern("[0-9]+")]],
    updateRequirements: [this.requirements],
    updateCapacity: [this.capacity, [Validators.required, Validators.pattern("[0-9]+")]],
  });


  get dateInput(){
    return this.orderInfoForm.get('dateInput');
  }

  get messageInput(){
    return this.orderInfoForm.get('messageInput');
  }

  get timeInput(){
    return this.orderInfoForm.get('timeInput');
  }

  get updateTitle(){
    return this.updateInfoForm.get('updateTitle');
  }

  get updateDescription(){
    return this.updateInfoForm.get('updateDescription');
  }

  get updatePrice(){
    return this.updateInfoForm.get('updatePrice');
  }

  get updateAvailability(){
    return this.updateInfoForm.get('updateAvailability');
  }

  get updatePerimeter(){
    return this.updateInfoForm.get('updatePerimeter');
  }

  get updateRequirements(){
    return this.updateInfoForm.get('updateRequirements');
  }

  get updateCapacity(){
    return this.updateInfoForm.get('updateCapacity');
  }





  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('serviceId')){
        //redirect
        return;
      }
      this.serviceId = paramMap.get('serviceId');
    });
   this.getEventServiceJson();
  }



  showOfferInput() {
    this.isInputing = true;
  }

  showUpdateInput() {
    if(this.requirements=='null') this.reqDisplay = '';
    else this.reqDisplay = this.requirements;
    this.isEditing = true;
  }

  stopEditing() {
    this.isEditing = false;
  }

  goHome() {
    location.replace("/start");
  }

  async sendOffer() {
    if(!this.validateOfferInput()) return;
    this.hasSentOfferInquiry = true;
    const message: string = this.messageInput.value;
    const date: string = this.dateInput.value;
    const time: string = this.timeInput.value;
    await this.http.post('http://localhost:3000/eventservice/order', {
      message: message,
      date: date,
      time: time,
      serviceId: this.serviceId,
      customerId: this.auth.getUserId(),
    }).subscribe(
    ()=>{
      console.log('successfully ordered');
      this.presentOrderFeedback(true);
    },
      (error)=>{
      console.log(error);
      this.presentOrderFeedback(false);
        this.hasSentOfferInquiry = false;
      }
    );
  }


  private async presentOrderFeedback(success: boolean) {
    let toast: any;
    if(success){
      this.isInputing = false;
      toast = await this.toast.create({
        message: 'Offer-inquiry sent',
        duration: 3000,
      });
    }
    else{
      toast = await this.toast.create({
        message: 'Failed to send inquiry',
        duration: 3000,
      })
    }
    await toast.present();
  }

  private report() {
    let infos = {
      serviceId:this.serviceId,
      userId:this.auth.getUserId()
    };
    this.http.post('http://localhost:3000/eventservice/report', infos).subscribe(
      (data) => {console.log(data)},
    (error) => {console.log(error)}
    );
    this.showToast("Service reported, it will be reviewed by the administrators");
    this.hasReported= true;
  }



  private addToFavorites(){
    this.http.put('http://localhost:3000/profile/addFavourite',
      {
        userId:this.auth.getUserId(),
        serviceId:this.serviceId
      }
    ).subscribe(
      () => {},
      (error) => {console.log(error)}
    )
  }

  /**
   * Calls backend to receive all necessary details about the event that the site is about and stores it in
   * local variables.
   */
  private getEventServiceJson() {
    this.http.get<EventServiceJson>('http://localhost:3000/eventservice/'+this.serviceId).subscribe(
      (data)=>{
        this.title = data.title;
        this.category = data.category;
        this.zip = data.zip;
        this.housenumber = data.housenumber;
        this.city = data.city;
        this.displayCity = data.city;
        this.street = data.street;
        this.availability = data.availability;
        this.displayAvailability = data.availability.split(',').join(' \n');
        this.description = data.description;
        this.requirements = data.requirements;
       switch(data.perimeter.toString()){
         case "0": {
           this.displayPerimeter = 'In';
           break;
         }
         case "1000000":{
           this.displayPerimeter = 'Throughout Switzerland';
           this.displayCity = '';
           break;
         }
         default:{
           this.displayPerimeter = 'Within ' + data.perimeter + ' km of';
           break;
         }
       }
        this.perimeter = data.perimeter;
        this.image = data.image;
        this.capacity = (data.capacity=='1000000')? 'no limit': data.capacity;
        this.subtype = data.subtype;
        this.price = data.price;
        this.providerId = data.providerId;
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  /**
   * Returns an appropriate string, that is suitable for the type of price according to event category
   */
  private getPriceFormat():string {
    let priceFormat:string;
    switch(this.category){
      case 'Location': {priceFormat = 'per Day'; break;}
      case 'Music': {priceFormat = 'per Day'; break;}
      case 'Food': {priceFormat = 'per Person'; break;}
      case 'Gastronomy': {priceFormat = 'per Person'; break;}
      case 'Entertainment': {priceFormat = 'per Day'; break;}
      case 'Photography': {priceFormat = 'per Day'; break;}
      default: {priceFormat = 'per event';}
    };
    return priceFormat;
  };


  redirectStartPage() {
    document.location.href = 'http://localhost:4200/start/';
  }

  /**
   * Checks if all the Input is valid and then sends it all to backend
   */
  tryToUpdate() {
    if(this.validateUpdateInput()){
      this.sendUpdate();
    }
  }

  /**
   * Sends all the information that was entered in the updateForm to the backend via http put request.
   */
  private sendUpdate() {
    this.http.put('http://localhost:3000/eventservice/update', {
      title: this.updateTitle.value,
      description: this.updateDescription.value,
      availability: this.updateAvailability.value.toString(),
      requirements: this.updateRequirements.value,
      capacity: this.updateCapacity.value,
      price: this.updatePrice.value,
      serviceId: this.serviceId,
      perimeter: this.updatePerimeter.value
    }).subscribe(
      ()=>{
        this.isEditing = false;
        this.showToast("Updated Infos");
        setTimeout(()=> {location.reload()},6000);
      },
      (error)=>{
        console.log(error);
        this.showToast("An Error occured: " + error);
      }
    )
  }

  /**
   * Checks if all fields of the updateForm are valid according to the validators. Then displays a toast to the user
   * stating what field we're not happy with.
   */
  private validateUpdateInput() {
    let error: string='';
    if (this.updateTitle.invalid)
      error += 'Title not valid \n';
    if (this.updateAvailability.value == '')
      error += 'Available days missing \n';
    if (this.updatePrice.invalid)
      error += 'Standard price invalid \n';
    if (this.updateDescription.invalid)
      error += 'Description invalid \n';
    if(this.updatePerimeter.invalid)
      error += 'Invalid Radius \n';
    if (error.length>=1) {
      this.showToast(error);
      return false;
    } else {
      return true;
    }
  }


  private validateOfferInput():boolean{
    let error: string = '';
    if(this.messageInput.invalid || this.timeInput.invalid || this.dateInput.invalid) error+= 'Please fill in all fields';
    if(error != ''){
      this.showToast(error);
      return false;
    }
    else return true;
  }
  /**
   * Displays the given message to the user in form of a toast
   * @param message what is being shown to the user
   */
  async showToast(message: string) {
    let toast = await this.toastController.create({
      message: message,
      duration: 5000,
    });
    await toast.present();
  }
}
