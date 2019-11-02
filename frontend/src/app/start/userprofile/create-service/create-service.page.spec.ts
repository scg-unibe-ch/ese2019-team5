import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateServicePage} from './create-service.page';

describe('CreateServicePage', () => {
  let component: CreateServicePage;
  let fixture: ComponentFixture<CreateServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateServicePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
