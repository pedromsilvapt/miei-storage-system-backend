import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDatatableComponent } from './custom-datatable.component';

describe('CustomDatatableComponent', () => {
  let component: CustomDatatableComponent;
  let fixture: ComponentFixture<CustomDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
