import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import * as Categories from "../../../../../../backend/app/categories";

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.page.html',
  styleUrls: ['./create-service.page.scss'],
})
export class CreateServicePage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient) {
  }

  ngOnInit() {
  }

  serviceForm = this.formBuilder.group({
    category: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(30)]],
    street: ['', Validators.required],
    housenumber: ['', [Validators.required, Validators.pattern('[1-9]*')]],
    zip: ['', [Validators.required, Validators.pattern('[1-9][1-9][1-9][1-9]')]],
    city: ['', Validators.required],
    distance: ['0', Validators.required],
    capacity: ['200+', Validators.required],
    availability: ['', Validators.required],
    price: ['', Validators.required],
    type: ['', Validators.required],
    requirements: [''],
    description: ['', Validators.maxLength(140)]
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

  get descrtiption() {
    return this.serviceForm.get('description');
  }

  createService() {
    //ToDo
  }

}


