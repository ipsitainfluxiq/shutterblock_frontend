import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebookComponent } from './webook.component';

describe('WebookComponent', () => {
  let component: WebookComponent;
  let fixture: ComponentFixture<WebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
