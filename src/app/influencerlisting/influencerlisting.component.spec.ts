import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerlistingComponent } from './influencerlisting.component';

describe('InfluencerlistingComponent', () => {
  let component: InfluencerlistingComponent;
  let fixture: ComponentFixture<InfluencerlistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfluencerlistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluencerlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
