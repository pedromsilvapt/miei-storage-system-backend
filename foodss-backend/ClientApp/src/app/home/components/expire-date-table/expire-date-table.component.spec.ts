import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpireDateTableComponent } from './expire-date-table.component';

describe('ExpireDateTableComponent', () => {
  let component: ExpireDateTableComponent;
  let fixture: ComponentFixture<ExpireDateTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpireDateTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpireDateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
