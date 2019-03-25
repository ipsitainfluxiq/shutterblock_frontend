import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferlistingComponent } from './offerlisting.component';

describe('OfferlistingComponent', () => {
  let component: OfferlistingComponent;
  let fixture: ComponentFixture<OfferlistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferlistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
