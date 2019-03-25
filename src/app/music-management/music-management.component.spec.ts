import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicManagementComponent } from './music-management.component';

describe('MusicManagementComponent', () => {
  let component: MusicManagementComponent;
  let fixture: ComponentFixture<MusicManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
