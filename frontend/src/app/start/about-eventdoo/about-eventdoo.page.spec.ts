import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutEventdooPage } from './about-eventdoo.page';

describe('AboutEventdooPage', () => {
  let component: AboutEventdooPage;
  let fixture: ComponentFixture<AboutEventdooPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutEventdooPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutEventdooPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
