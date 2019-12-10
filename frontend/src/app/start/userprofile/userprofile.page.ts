import { Component, OnInit } from '@angular/core';
import {AlertController, Platform} from "@ionic/angular";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../AuthService/auth.service";
import {userJson} from "./userJson";
import {EventService} from "../../../../../backend/app/models/eventService.model";

/**
 * The user profile page displays the personal info of the user accessing it and enables him to change this information.
 * Furthermore the user will wind an overview of the services he is offering and can delete them or add more.
 * This class handles the exchange of the relevant information and their modifications.
 */
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
})


export class UserprofilePage implements OnInit {


  readonly ROOT_URL = 'http://localhost:3000/profile/';
  private userId: number;

  private firstname: string = 'initial';
  private lastname: string = '';
  private email:string = '';
  private street: string = '';
  private housenumber: string = '';
  private zip: string = '';
  private city: string = '';
  private firmname: string = '';
  private phonenumber: string = '';
  private numberOfServices: number = 0;

  private eventServiceArrayOfUser: EventService[];

  public devWidth = this.platform.width();

  httpGetSuccess:boolean;
  isEditing:boolean = false;


  constructor(
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authservice:AuthService,
    private alert: AlertController,
    private platform: Platform) { }


  /**
   * Before any Information can be displayed it has to be fetched from backend
   */
  ngOnInit() {
    this.getUserData();
  }

  /**
   * Form for collecting updated user info and to verify their correctness.
   */
  editForm = this.formBuilder.group({
    firstnameInput: [this.firstname, [Validators.required, Validators.pattern('[a-zA-ZäÄöÖüÜ,\\s]{2,}')]],
    lastnameInput: [this.lastname, [Validators.required,  Validators.pattern('[a-zA-ZäÄöÖüÜ,\\s]{2,}')]],
    firmnameInput: [this.firmname, Validators.pattern('[a-zA-ZäÄöÖüÜ0-9\\s]{2,}')],
    streetInput: [this.street, [Validators.required,  Validators.pattern('[a-zA-ZäÄöÖüÜ,\\s]{2,}')]],
    housenumberInput: [this.housenumber, [Validators.required, Validators.pattern('[1-9]+[0-9]*[a-zA-Z]?')]],
    zipInput: [this.zip, [Validators.required, Validators.pattern('[0-9]{4}')]],
    cityInput: [this.city, [Validators.required, Validators.pattern('[a-zA-ZäÄöÖüÜ,\\s]{2,}')]],
    phonenumberInput: [this.phonenumber, [Validators.pattern('[+]?[0-9\\s]+')]]
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
      this.http.get<userJson>(this.ROOT_URL + this.userId)
        .subscribe(
          (user)=> {
            this.firstname = user.firstname;
            this.lastname = user.lastname;
            this.email = user.email;
            this.street = user.street;
            this.housenumber = user.housenumber;
            this.zip = user.zip;
            this.city = user.city;
            this.numberOfServices = user.size;
            if(user.firmname!='null' && user.firmname!=null) this.firmname = user.firmname;
            if(user.phonenumber!='null' && user.phonenumber!=null)this.phonenumber = user.phonenumber;
            this.eventServiceArrayOfUser = user.eventServiceArrayOfUser;
            this.httpGetSuccess = true;
          },
          (error)=> {
            this.httpGetSuccess = false;
            console.log(error);
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

  /**
   * Sends all the information collected by updateform to the backend.
   */
  saveChanges(){
    this.firstname = this.firstnameInput.value;
    this.lastname = this.lastnameInput.value;
    this.street = this.streetInput.value;
    this.housenumber = this.housenumberInput.value;
    this.zip = this.zipInput.value;
    this.city = this.cityInput.value;
    this.firmname = this.firmnameInput.value;
    this.phonenumber = this.phonenumberInput.value;
    const isFirm = (this.firmname !=null && this.firmname!='null' && this.firmname!='');
    this.http.post(this.ROOT_URL+'update', {
      id: this.userId,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      firmname: this.firmname,
      street: this.street,
      housenumber: this.housenumber,
      zip: this.zip,
      city: this.city,
      phonenumber: this.phonenumber,
      isFirm: isFirm
    })
      .subscribe(
        (success) => {
          this.httpGetSuccess = true;
        },
        (error) => {
          this.httpGetSuccess = false;
          console.log(error);
        }
      );
    this.isEditing = false;
  }

  /**
   * Pops up an alert to let the user confirm that he intended to delete his profile when clicking the button.
   */
  async showDeleteProfileConfirm(){
    const alert = await this.alert.create({
      header: 'Confirm Delete',
      message: 'Do you really want to delete your Profile? You cannot undo this action',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: ()=>{
            this.deleteUserProfile(this.userId);
            }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Orders backend to delete this profile.
   * @param userId Id of user profile that will be deleted
   */
  private async deleteUserProfile(userId: number) {
    await this.http.delete('http://localhost:3000/profile/'+userId)
      .subscribe(
        (res)=> {console.log('delete success')},
        (error)=>{ console.log(error)}
      );
    this.authservice.logout();
    //document.location.href = 'http://localhost:4200/start/';
  }

  redirectStartPage() {
    document.location.href = 'http://localhost:4200/start/';
  }

}
