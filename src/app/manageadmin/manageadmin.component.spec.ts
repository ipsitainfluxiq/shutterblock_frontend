import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageadminComponent } from './manageadmin.component';

describe('ManageadminComponent', () => {
  let component: ManageadminComponent;
  let fixture: ComponentFixture<ManageadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
