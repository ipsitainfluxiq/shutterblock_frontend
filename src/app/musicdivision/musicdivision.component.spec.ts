import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicdivisionComponent } from './musicdivision.component';

describe('MusicdivisionComponent', () => {
  let component: MusicdivisionComponent;
  let fixture: ComponentFixture<MusicdivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicdivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicdivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
