import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingManagementComponent } from './marketing-management.component';

describe('MarketingManagementComponent', () => {
  let component: MarketingManagementComponent;
  let fixture: ComponentFixture<MarketingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
