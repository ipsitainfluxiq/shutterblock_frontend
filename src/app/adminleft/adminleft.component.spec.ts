import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminleftComponent } from './adminleft.component';

describe('AdminleftComponent', () => {
  let component: AdminleftComponent;
  let fixture: ComponentFixture<AdminleftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminleftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminleftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
