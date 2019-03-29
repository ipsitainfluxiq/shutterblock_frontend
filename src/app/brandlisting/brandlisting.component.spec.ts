import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandlistingComponent } from './brandlisting.component';

describe('BrandlistingComponent', () => {
  let component: BrandlistingComponent;
  let fixture: ComponentFixture<BrandlistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandlistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
