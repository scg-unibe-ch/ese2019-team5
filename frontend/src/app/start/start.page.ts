import { Component, OnInit } from '@angular/core';
import {AuthService} from "../AuthService/auth.service";
import {EventService} from "../../../../backend/app/models/eventService.model";
import {SearchService} from "../SearchService/search.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";



@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  loading: boolean;
  services: EventService[];


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private searchService: SearchService,
    private formBuilder: FormBuilder
  ) {}

  searchForm = this.formBuilder.group({
      category: [''],
      subtype: [''],
      city: [''],
      price: [''],
      persons: [''],
      text: ['']
    });

  get category () {
    return this.searchForm.get('category');
  }
  get subtype() {
    return this.searchForm.get('subtype');
  }
  get city() {
    return this.searchForm.get('city');
  }
  get price() {
    return this.searchForm.get('price');
  }
  get text() {
    return this.searchForm.get('text');
  }

  search() {

  }

 ngOnInit() {
    this.loading = true;
    this.http.get<Array<EventService>>('http://localhost:3000/search')
      .subscribe(
        (data)=> {
          this.services = data;
        }, (error) => {
          console.log(error);
        });
    this.loading = false;

  }

}
