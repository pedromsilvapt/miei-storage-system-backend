import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageDatatableComponent } from './storage-datatable.component';

describe('StorageDatatableComponent', () => {
  let component: StorageDatatableComponent;
  let fixture: ComponentFixture<StorageDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
