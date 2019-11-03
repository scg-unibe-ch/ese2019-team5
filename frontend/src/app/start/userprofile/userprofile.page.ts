import { Component, OnInit } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {User} from "../../../../../backend/app/models/user.model";
import {Address} from "../../../../../backend/app/models/address.model";
import {AuthService} from "../../AuthService/auth.service";


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
})
export class UserprofilePage implements OnInit {

  /* ToDo: implement function to send a full set of userinformation to backend
     ToDo: read changed input

   */
  readonly ROOT_URL = 'http://localhost:3000/userprofile';
  private userId: number;

  private firstname: string;
  private lastname: string;
  private email:string;
  private street: string;
  private housenumber: number;
  private zip: number;
  private city: string;
  private user: User;
  httpGetSuccess:boolean;


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
      let params = new HttpParams();
      params.append("userId", this.userId.toString());
      this.http.get(this.ROOT_URL, {params: params})
        .subscribe(
          (user:User)=> {
            this.user= user;
            this.httpGetSuccess = true;
          },
          (error)=> {
            this.httpGetSuccess = false;
            console.log(error());
          });
      this.firstname = this.user.getFirstname();
      this.lastname = this.user.getLastname();
      let address: Address = this.user.getAddress();
      this.housenumber = address.housenumber;
      this.zip = address.zip;
      this.city = address.city;
    }
    catch (e) {
      this.httpGetSuccess = false;
      console.log(e);
    }
  }

async showUpdateField(){
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
            if(data.firstname.length>0
            && data.lastname.length>0
            && data.street.length>0
            && data.housenumber.valueOf>0
            && data.housenumber.matches("[0-9]+")
              && data.zip.length==4
            && data.zip.matches("[0-9]+")
            && data.city.length >0) {
              this.firstname = data.firstname;
              this.lastname = data.lastname;
              this.street = data.street;
              this.housenumber = data.housenumber;
              this.zip = data.zip;
              this.city = data.city;
              this.http.put(this.ROOT_URL, {
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
            }
              else{
                this.httpGetSuccess = false;
              }
            }
        }
      ]
    });
 await inputField.present();
  }

}
