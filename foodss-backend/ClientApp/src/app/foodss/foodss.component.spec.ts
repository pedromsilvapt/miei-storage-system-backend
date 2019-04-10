import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodssComponent } from './foodss.component';

describe('FoodssComponent', () => {
  let component: FoodssComponent;
  let fixture: ComponentFixture<FoodssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
