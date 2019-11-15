import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AlertController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

import {Camera} from "@ionic-native/camera/ngx";

import {AuthService} from "../../../AuthService/auth.service";



@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.page.html',
  styleUrls: ['./create-service.page.scss'],
})

export class CreateServicePage implements OnInit {

  image: string;

  //Some properties used for user feedback
  loading: boolean;
  error: string;



  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private camera: Camera
  ) {
  }

  ngOnInit() {
    this.loading = false;
    this.error = '';
  }

  serviceForm = this.formBuilder.group({
    category: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(30)]],
    street: ['', Validators.required],
    housenumber: ['', [Validators.required, Validators.pattern('[1-9]*')]],
    zip: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(4), Validators.minLength(4)]],
    city: ['', Validators.required],
    distance: ['0', Validators.required],
    capacity: ['1000000', Validators.required],
    availability: ['', Validators.required],
    price: ['', Validators.required],
    type: ['', Validators.required],
    requirements: [''],
    description: ['', Validators.maxLength(140)],
    picture: ['']
  });

  get category() {
    return this.serviceForm.get('category');
  }
  get title() {
    return this.serviceForm.get('title');
  }
  get street() {
    return this.serviceForm.get('street');
  }
  get housenumber() {
    return this.serviceForm.get('housenumber');
  }
  get zip() {
    return this.serviceForm.get('zip');
  }
  get city() {
    return this.serviceForm.get('city');
  }
  get distance() {
    return this.serviceForm.get('distance');
  }
  get capacity() {
    return this.serviceForm.get('capacity');
  }
  get availability() {
    return this.serviceForm.get('availability');
  }
  get price() {
    return this.serviceForm.get('price');
  }
  get type() {
    return this.serviceForm.get('type');
  }
  get requirements() {
    return this.serviceForm.get('requirements');
  }
  get description() {
    return this.serviceForm.get('description');
  }
  get picture() {
    return 'data:image/jpeg;base64,' + this.serviceForm.get('picture');
  }

  /*accessCamera() {
    this.camera.getPicture({
      targetWidth: 512,
      targetHeight: 512,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then(
      (imageData) => {
        this.image = 'data:image/jpeg;base64,' + imageData;
        this.picture = imageData;
      },
      (error) => {
        console.log(error)
      });
  }

  accessGallery() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then(
      (imageData) => {
        this.image = 'data:image/jpeg;base64,' + imageData;
        this.picture = imageData;
      },
      (error) => {
        console.log(error);
      });
  }*/

  //ToDo: Test whether this works with backend
  /**
   * Called by the user by pushing the correspondent button
   * Sets the body-params and makes a http-request to the backend
   * Handles the result
   */
  createService() {
    // To see the format of the input. Can be deleted later.
    console.log(this.category.value + ' | ' + this.title.value);
    console.log(this.street.value + ' | ' + this.housenumber.value + ' | ' + this.zip.value + ' | ' + this.city.value);
    console.log(this.distance.value + ' | ' + this.capacity.value);
    console.log(this.availability.value + ' | ' + this.price.value);
    console.log(this.type.value);
    console.log(this.requirements.value + ' | ' + this.description.value);

    this.loading = true;
    if (this.validateInput()) {
      console.log('Input is valid');
      const providerId = this.authService.getUserId();
      const category = this.category.value;
      const title = this.title.value;
      const street = this.street.value;
      const housenumber = this.housenumber.value;
      const zip = this.zip.value;
      const city = this.city.value;
      const capacity = 0 + this.capacity.value;
      console.log(capacity);
      const perimeter = 0 + this.distance.value;
      const availability = JSON.stringify(this.availability.value);
      console.log(availability);
      const price = 0 + this.price.value;
      console.log(price);
      const subtype = JSON.stringify(this.setType());
      console.log(subtype);
      const requirements = this.requirements.value;
      console.log(requirements);
      const description = this.description.value;
      const image = this.picture;

      console.log('Params set. Starting http request');

      this.http.post('http://localhost:3000/eventservice/add',
        {
          providerId, category, title, street, housenumber, zip, city, perimeter, capacity,
          availability, price, subtype, requirements, description, image
        }).subscribe(
        () => {
          console.log('success');
          this.loading = false;
          this.ConfirmationPopUp().then(r => {
          });
        },
        (error) => {
          console.log('error' + error.message);
          this.loading = false;
          this.error = error.message;
        });


    }
  }

  /**
   * ConfirmationPopUp
   * Called by {@link createService} when creating a service was successful
   * Navigates the user to {@link StartPage} or {@link UserProfilePage}
   */
  async ConfirmationPopUp() {
    const alert = await this.alertController.create({
      header: 'Service was Created successfully',
      message: this.category.value + 'Service: ' + this.title.value + 'has successfully been created. What do you want to do next?',
      buttons: [
        {
          text: 'Go to start page',
          handler: () => {
            this.router.navigate(['/start']);
          }
        },
        {
          text: 'Go to profile page',
          handler: () => {
            this.router.navigate(['/start/userprofile']);
          }
        }]
    });

    await alert.present();
  }

  /* --- Helper Methods --- */

  /**
   * Called by {@link createService()}
   * Returns the "type" constant according to the user input
   */
  private setType() {
    switch (this.category.value) {

      case 'Gastronomy':
      case 'Music':
      case 'Entertainment':
        return this.type.value;

      default:
        // Location or Photographer (or none)
        return [''];
    }
  }


  /**
   * Called by {@link createService()}
   * Validates the most important inputs
   */
  private validateInput() {
    if (this.category.value == '')
      this.error += 'Category missing \n';
    if (this.title.invalid)
      this.error += 'Title missing \n';
    if (this.street.invalid || this.housenumber.invalid || this.zip.invalid || this.city.invalid)
      this.error += 'Invalid address \n';
    if (this.availability.value == '')
      this.error += 'Available days missing \n';
    if (this.price.value == '')
      this.error += 'Standard price missing \n';
    if (this.description.value == '')
      this.error += 'Description missing';

    if (this.error) {
      this.loading = false;
      return false;
    } else {
      return true;
    }
  }

}


