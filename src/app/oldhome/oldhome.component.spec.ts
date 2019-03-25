import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldhomeComponent } from './oldhome.component';

describe('OldhomeComponent', () => {
  let component: OldhomeComponent;
  let fixture: ComponentFixture<OldhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
