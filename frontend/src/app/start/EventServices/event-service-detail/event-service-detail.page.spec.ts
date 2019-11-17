import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventServiceDetailPage } from './event-service-detail.page';

describe('EventServiceDetailPage', () => {
  let component: EventServiceDetailPage;
  let fixture: ComponentFixture<EventServiceDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventServiceDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventServiceDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
