import { Component, OnInit } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {FormBuilder} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
  readonly ROOT_URL = 'http://localhost:3000/profile';
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
      let headers = new HttpHeaders();
      headers.append("userId", this.userId.toString());
      this.http.get(this.ROOT_URL, {headers: headers})
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
}
