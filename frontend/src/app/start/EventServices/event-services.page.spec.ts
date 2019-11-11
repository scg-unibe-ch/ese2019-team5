import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventServicesPage } from './event-services.page';

describe('EventServicesPage', () => {
  let component: EventServicesPage;
  let fixture: ComponentFixture<EventServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
