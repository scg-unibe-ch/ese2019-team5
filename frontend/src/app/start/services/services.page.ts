import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  readonly ROOT_URL = 'http://localhost:3000/services/';

  constructor() { }

  ngOnInit() {
  }

}
