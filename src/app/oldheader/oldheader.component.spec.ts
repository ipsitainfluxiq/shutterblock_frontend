import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldheaderComponent } from './oldheader.component';

describe('OldheaderComponent', () => {
  let component: OldheaderComponent;
  let fixture: ComponentFixture<OldheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
