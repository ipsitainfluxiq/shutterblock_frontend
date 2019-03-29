import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAModelComponent } from './become-a-model.component';

describe('BecomeAModelComponent', () => {
  let component: BecomeAModelComponent;
  let fixture: ComponentFixture<BecomeAModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeAModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeAModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
