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
      weekday: [''],
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
  get weekdays() {
    return this.searchForm.get('weekday');
  }
  get city() {
    return this.searchForm.get('city');
  }
  get price() {
    return this.searchForm.get('price');
  }
  get persons() {
    return this.searchForm.get('persons');
  }
  get text() {
    return this.searchForm.get('text');
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

  search() {
    let url = this.getUrl()
    this.http.get<Array<EventService>>(url).subscribe(
      (data) => {
        this.services = data;
      },
    (err) => {
        console.log(err.message)
    }
    );
  }

  private getUrl() {
    let result = 'http://localhost:3000/search/filter/';

    if (this.text.value == '')
      result += ':textsearch?';
    else
      result += (':text?text=' + this.text.value + '&');

    if (this.category.value != '')
      result += ('category=' + this.category.value + '&');
    if (this.subtype.value != '')
      result += ('subtype=' + this.subtype.value + '&');
    if (this.city.value != '')
      result += ('city=' + this.city.value + '&');
    if (this.price.value != '')
      result += ('price=' + this.price.value + '&');
    if (this.persons.value != '')
      result += ('people=' + this.persons.value + '&');
    if (this.weekdays.value != '')
      result += ('availability=' + this.weekdays.value + '&');

    if (result.charAt(result.length - 1) == '&') {
      console.log(result.substr(0, result.length - 1));
      return (result.substr(0, result.length - 1));
    } else {
      console.log(result);
      return result;
    }
  }



}
