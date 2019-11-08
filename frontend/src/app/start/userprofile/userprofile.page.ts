import { Component, OnInit } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {User} from "../../../../../backend/app/models/user.model";
import {Address} from "../../../../../backend/app/models/address.model";
import {AuthService} from "../../AuthService/auth.service";
import {userJson} from "./userJson";


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
})


export class UserprofilePage implements OnInit {

  /* ToDo: implement function to send a full set of userinformation to backend
     ToDo: read changed input

   */
  readonly ROOT_URL = 'http://localhost:3000/profile/';
  private userId: number;

  private firstname: string = '';
  private lastname: string = '';
  private email:string = '';
  private street: string = '';
  private housenumber: string = '';
  private zip: string = '';
  private city: string = '';
  private firmname: string = '';
  private phonenumber: string = '';

  httpGetSuccess:boolean;
  isEditing:boolean = false;


  constructor(
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authservice:AuthService) { }

  ngOnInit() {
    this.getUserData();
  }

  editForm = this.formBuilder.group({
    firstnameInput: [this.firstname, [Validators.required]],
    lastnameInput: ['', Validators.required],
    firmnameInput: [''],
    streetInput: ['', Validators.required],
    housenumberInput: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    zipInput: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]+')]],
    cityInput: ['', Validators.required],
    phonenumberInput: ['', [Validators.pattern('[0-9]+')]]
  });

  get firstnameInput() {
    return this.editForm.get('firstnameInput');
  }

  get lastnameInput() {
    return this.editForm.get('lastnameInput');
  }

  get firmnameInput() {
    return this.editForm.get('firmnameInput');
  }

  get streetInput() {
    return this.editForm.get('streetInput');
  }

  get housenumberInput() {
    return this.editForm.get('housenumberInput');
  }

  get zipInput() {
    return this.editForm.get('zipInput');
  }

  get cityInput() {
    return this.editForm.get('cityInput');
  }

  get phonenumberInput() {
    return this.editForm.get('phonenumberInput');
  }

  /**
   * Fetching UserInformation from Backend to display
   */
  getUserData(){
    try {
      this.userId = this.authservice.getUserId();
     //var userJson: userJson = {firstname: 'not initialized', lastname: 'not initialized', email: 'not initialized', street: 'not initialized', housenumber: 'not initialized', zip: 'not initialized', city: 'not initialized'};
      this.http.get<userJson>(this.ROOT_URL + this.userId)
        .subscribe(
          (user)=> {

            this.firstname = user.firstname; //this.user.getFirstname();
            this.lastname = user.lastname; //this.user.getLastname();
            this.email = user.email;
            //let address: Address = this.user.getAddress();
            this.street = user.street;
            this.housenumber = user.housenumber; //address.housenumber;
            this.zip = user.zip; //address.zip;
            this.city = user.city; //address.city;
            this.firmname = user.firmname;
            this.phonenumber = user.phonenumber;
            this.httpGetSuccess = true;
          },
          (error)=> {
            this.httpGetSuccess = false;
            console.log(error());
          });


    }
    catch (e) {
      this.httpGetSuccess = false;
      console.log(e);
    }
  }

  enableEditing(){
    this.isEditing = true;
  }

  saveChanges(){
    this.firstname = this.firstnameInput.value;
    this.lastname = this.lastnameInput.value;
    this.street = this.streetInput.value;
    this.housenumber = this.housenumberInput.value;
    this.zip = this.zipInput.value;
    this.city = this.cityInput.value;
    this.firmname = this.firmnameInput.value;
    this.phonenumber = this.phonenumberInput.value;
    console.log('front here');
    this.http.post(this.ROOT_URL+'update', {
      id: this.userId,
      firstname: this.firstname,
      lastname: this.lastname,
      firmname: this.firmname,
      street: this.street,
      housenumber: this.housenumber,
      zip: this.zip,
      city: this.city,
      phonenumber: this.phonenumber
    })
      .subscribe(
        (success) => {
          this.httpGetSuccess = true;
        },
        (error) => {
          this.httpGetSuccess = false;
        }
      );
    this.getUserData();
    this.isEditing = false;
  }


}
