import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../../../../../../backend/app/models/eventService.model";
import {FormBuilder, Validators} from "@angular/forms";
import {ToastController} from "@ionic/angular";
import {AuthService} from "../../../AuthService/auth.service";
import {EventServiceJson} from "../../userprofile/EventServiceJson";
import {Observable, Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-event-service-detail',
  templateUrl: './event-service-detail.page.html',
  styleUrls: ['./event-service-detail.page.scss'],
})
export class EventServiceDetailPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toast: ToastController,
    private auth: AuthService,
    private toastController: ToastController,
  ) { }

  orderInfoForm = this.formBuilder.group({
    dateInput: ['', [Validators.required]],
    messageInput: ['', [Validators.required]],
    timeInput: ['', [Validators.required]],
  });

  updateInfoForm = this.formBuilder.group({
    updateTitle: ['', [Validators.required, Validators.minLength(3)]],
    updateDescription: ['', [Validators.required, Validators.minLength(3)]],
    updatePrice: ['', Validators.required, Validators.pattern('([0-9]+(.[0-9]{2})?){1}')],
    updateAvailability: ['', [Validators.required]],
    updatePerimiter: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    updateCity: ['', Validators.required, Validators.pattern('[a-zA-Z,\s]+')],
    updateRequirements: [''],
    updateCapacity: ['', [Validators.required, Validators.pattern("[0-9]+")]],
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

  get updatePerimiter(){
    return this.updateInfoForm.get('updatePerimiter');
  }

  get updateCity(){
    return this.updateInfoForm.get('updateCity');
  }

  get updateRequirements(){
    return this.updateInfoForm.get('updateRequirements');
  }

  get updateCapacity(){
    return this.updateInfoForm.get('updateCapacity');
  }


  private serviceId: string;
  private isInputing: boolean = false;
  private isEditing: boolean = false;

  private category:string;
  private title:string;
  private description:string;
  private city:string;
  private zip:string;
  private housenumber:string;
  private street:string;
  private perimeter:string;
  private availability:string;
  private requirements:string;
  private reqDisplay: string;
  private subtype:string;
  private capacity:string;
  private price:string;
  private image:string;
  private providerId: string;


  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('serviceId')){
        //redirect
        return;
      }
      this.serviceId = paramMap.get('serviceId');
      console.log(this.serviceId);
    });
    //const params = new HttpParams().set('serviceId', this.serviceId);
   this.getEventServiceJson();
   //this.loadPhoto()
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

  async sendOffer() {
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
    (res)=>{
      console.log('successfully ordered');
      this.presentOrderFeedback(true);
    },
      (error)=>{
      console.log(error);
      this.presentOrderFeedback(false);
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
    }
    this.http.post('http://localhost:3000/eventservice/report', infos).subscribe(
      (data) => {console.log(data)},
    (error) => {console.log(error)}
    )
  }

  private addToFavorites(){
    this.http.put('http://localhost:3000/profile/addFavourite/' + this.auth.getUserId() + '/' + this.serviceId, {}).subscribe(
      (data) => {console.log(data)},
      (error) => {console.log(error)}
    )
  }

  private getEventServiceJson() {
    this.http.get<EventServiceJson>('http://localhost:3000/eventservice/'+this.serviceId).subscribe(
      (data)=>{
        this.title = data.title;
        this.category = data.category;
        this.zip = data.zip;
        this.housenumber = data.housenumber;
        this.city = data.city;
        this.street = data.street;
        this.availability = data.availability;
        this.description = data.description;
        this.requirements = data.requirements;
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

  tryToUpdate() {
    if(this.validateUpdateInput()){
      this.sendUpdate();
    }
  }


  private sendUpdate() {
    this.http.put('http://localhost:3000/eventservice/update', {
      title: this.updateTitle.value,
      description: this.updateDescription.value,
      availability: this.updateAvailability.value.toString(),
      requirements: this.updateRequirements.value,
      capacity: this.updateCapacity.value,
      price: this.updatePrice.value,
      serviceId: this.serviceId,
      perimiter: this.updatePerimiter.value,
      city: this.updateCity.value
    }).subscribe(
      ()=>{
        this.isEditing = false;
        this.showToast("Updated Infos");
        setTimeout(()=> {location.reload()},4000);
      },
      (error)=>{
        console.log(error);
        this.showToast("An Error occured: " + error);
      }
    )
  }

  private validateUpdateInput() {
    let error: string='';
    if (this.updateTitle.invalid)
      error += 'Title not valid \n';
    if (this.updateCity.invalid)
      error += 'Invalid city name \n';
    if (this.updateAvailability.value == '')
      error += 'Available days missing \n';
    if (this.updatePrice.invalid)
      error += 'Standard price invalid \n';
    if (this.updateDescription.invalid)
      error += 'Description invalid';
    if(this.updatePerimiter.invalid)
      error += 'Invalid Radius';
    if (error.length>=1) {
      this.showToast(error);
      return false;
    } else {
      return true;
    }
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
    console.log(message);
    await toast.present();
  }
}
