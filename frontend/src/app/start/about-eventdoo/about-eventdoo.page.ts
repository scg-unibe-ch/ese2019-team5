import { Component, OnInit } from '@angular/core';

/**
 * Page providing all important information about Eventdoo.
 * Linked on all pages in the footer.
 */

@Component({
  selector: 'app-about-eventdoo',
  templateUrl: './about-eventdoo.page.html',
  styleUrls: ['./about-eventdoo.page.scss'],
})
export class AboutEventdooPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  redirectStartPage() {
    document.location.href = 'http://localhost:4200/start/';
  }

}
