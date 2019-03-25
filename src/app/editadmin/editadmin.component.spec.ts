import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditadminComponent } from './editadmin.component';

describe('EditadminComponent', () => {
  let component: EditadminComponent;
  let fixture: ComponentFixture<EditadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
