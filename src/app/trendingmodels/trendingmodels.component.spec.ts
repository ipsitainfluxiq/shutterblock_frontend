import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingmodelsComponent } from './trendingmodels.component';

describe('TrendingmodelsComponent', () => {
  let component: TrendingmodelsComponent;
  let fixture: ComponentFixture<TrendingmodelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingmodelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingmodelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
