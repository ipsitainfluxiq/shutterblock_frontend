import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencelistComponent } from './influencelist.component';

describe('InfluencelistComponent', () => {
  let component: InfluencelistComponent;
  let fixture: ComponentFixture<InfluencelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfluencelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluencelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
