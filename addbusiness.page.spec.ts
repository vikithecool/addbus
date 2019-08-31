import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbusinessPage } from './addbusiness.page';

describe('AddbusinessPage', () => {
  let component: AddbusinessPage;
  let fixture: ComponentFixture<AddbusinessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbusinessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbusinessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
