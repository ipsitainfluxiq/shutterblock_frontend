import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurModelsComponent } from './our-models.component';

describe('OurModelsComponent', () => {
  let component: OurModelsComponent;
  let fixture: ComponentFixture<OurModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
