import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../../../../../../backend/app/models/eventService.model";
import {FormBuilder, Validators} from "@angular/forms";
import {ToastController} from "@ionic/angular";
import {AuthService} from "../../../AuthService/auth.service";

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
    private auth: AuthService
  ) { }

  orderInfoForm = this.formBuilder.group({
    dateInput: ['', [Validators.required]],
    messageInput: ['', [Validators.required]],
    timeInput: ['', [Validators.required]],
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



  private serviceId: string;
  private loadedEventService: EventService;
  private isInputing: boolean = false;

  private title: string;
  private description: string;

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
    this.http.get<EventService>('http://localhost:3000/eventservice/'+this.serviceId).subscribe(
    (data)=>{
      this.loadedEventService = data;
      this.assignInfos();
    },
    (error)=>{
      console.log(error);
    }
    )
  }

  private assignInfos() {
    //this.description = this.loadedEventService);
  }

  showOfferInput() {
    this.isInputing = true;
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
}
