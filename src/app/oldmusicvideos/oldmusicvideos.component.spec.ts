import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldmusicvideosComponent } from './oldmusicvideos.component';

describe('OldmusicvideosComponent', () => {
  let component: OldmusicvideosComponent;
  let fixture: ComponentFixture<OldmusicvideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldmusicvideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldmusicvideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
