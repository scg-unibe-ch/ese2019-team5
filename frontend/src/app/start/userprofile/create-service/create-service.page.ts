import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AlertController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

import {Camera} from "@ionic-native/camera/ngx";

import {AuthService} from "../../../AuthService/auth.service";
import {Observable, Subject} from "rxjs";
import {userJson} from "../userJson";



@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.page.html',
  styleUrls: ['./create-service.page.scss'],
})

export class CreateServicePage implements OnInit {

  image: string;
  base64: any;

  //Some properties used for user feedback
  loading: boolean;
  error: string;
  numberOfServices: number = 0;



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
    this.base64 = '';
    this.http.get<userJson>('http://localhost:3000/profile/' + this.authService.getUserId())
      .subscribe(
        (user)=> {
          this.numberOfServices = user.size;
        });
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
    description: ['', Validators.maxLength(700)],
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
    return this.serviceForm.get('picture');
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

  /**
   * Called by the user by pushing the correspondent button
   * Sets the body-params and makes a http-request to the backend
   * Handles the result
   */
  createService() {

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
      const perimeter = 0 + this.distance.value;
      const availability = this.availability.value.toString();
      const price = 0 + this.price.value;
      const subtype = JSON.stringify(this.setType());
      const requirements = this.requirements.value;
      const description = this.description.value;
      const image = this.base64;

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
   * Navigates the user to {@link StartPage} or {@link UserprofilePage}
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
   * Called whenever a user selects an image to upload for his/her service
   * Creates a preview of the image and stores the base64String
   */
 previewFiles() {
    // @ts-ignore
    var file = document.querySelector('input[type=file]').files[0];
    var preview = document.querySelector('#preview');

    console.log("old: " + this.base64);
    this.getB64String(file).subscribe((output) => {
      console.log("out: " + output);
      var image = new Image();
      image.height = 200;
      image.width = 300;
      image.title = file.name;
      image.src = output;
      preview.appendChild(image);
    });
  }

  /**
   * Called by {@link previewFiles}
   * Used to get the base64String when uploading an image
   * @param file
   */
  private getB64String(file: File): Observable<string> {
    const sub = new Subject<string>();
    var reader = new FileReader();

    reader.onload = (function () {
      //console.log(reader.result.toString().split(',')[1]);

      const content: string = reader.result.toString();
      sub.next(content);
      sub.complete();
    });
    reader.readAsDataURL(file);
    return sub.asObservable();

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

  redirectToStartPage() {
    document.location.href = 'http://localhost:4200/start/';
  }
}


