import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelandtalentComponent } from './modelandtalent.component';

describe('ModelandtalentComponent', () => {
  let component: ModelandtalentComponent;
  let fixture: ComponentFixture<ModelandtalentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelandtalentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelandtalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
