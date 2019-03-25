import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelMarketingComponent } from './model-marketing.component';

describe('ModelMarketingComponent', () => {
  let component: ModelMarketingComponent;
  let fixture: ComponentFixture<ModelMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
