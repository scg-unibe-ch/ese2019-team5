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

  private firstname: string;
  private lastname: string;
  private email:string;
  private street: string;
  private housenumber: string;
  private zip: string;
  private city: string;
  private firmname: string;
  private phonenumber: string;

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

async showUpdateField(){
    //this.isEditing ? true;
  const inputField = await this.alertCtrl.create({
      header: 'Edit my Info',
      inputs: [
        {
          name: 'firstname',
          placeholder: 'Firstname',
          type: "text"
        },
        {
          name: 'lastname',
          placeholder: 'Lastname',
          type: "text"
        },
        {
          name: 'street',
          placeholder: 'Street',
          type: "text"
        },
        {
          name: 'housenumber',
          placeholder: 'Number',
          type: "number"
        },
        {
          name: 'zip',
          placeholder: 'Zip',
          type: "number"
        },
        {
          name: 'city',
          placeholder: 'City',
          type: "text"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: data => {
         /*   if(data.firstname.length>0
            && data.lastname.length>0
            && data.street.length>0
            && data.housenumber.valueOf>0
            && data.housenumber.matches("[0-9]+")
              && data.zip.length==4
            && data.zip.matches("[0-9]+")
            && data.city.length >0) {*/
              this.firstname = data.firstname;
              this.lastname = data.lastname;
              this.street = data.street;
              this.housenumber = data.housenumber;
              this.zip = data.zip;
              this.city = data.city;
              this.firmname = ''; // ToDo: assign inputfield to firmname and phone
              this.phonenumber = '';
              console.log('front here');
              this.http.post(this.ROOT_URL+'update', {
                id: this.userId,
                firstname: this.firstname,
                lastname: this.lastname,
                street: this.street,
                housenumber: this.housenumber,
                zip: this.zip,
                city: this.city
              })
              .subscribe(
                  (success) => {
                    this.httpGetSuccess = true;
                  },
                  (error) => {
                    this.httpGetSuccess = false;
                  }
                );
            //}
           /*   else{
                this.httpGetSuccess = false;
              }*/
            }
        }
      ]
    });
  this.getUserData();
 await inputField.present();
  }



}
