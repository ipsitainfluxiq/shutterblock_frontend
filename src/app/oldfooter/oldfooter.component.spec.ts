import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldfooterComponent } from './oldfooter.component';

describe('OldfooterComponent', () => {
  let component: OldfooterComponent;
  let fixture: ComponentFixture<OldfooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
