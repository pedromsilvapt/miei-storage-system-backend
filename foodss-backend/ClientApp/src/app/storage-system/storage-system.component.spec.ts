import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {StorageSystemComponent} from './storage-system.component';


describe('StorageSystemComponent', () => {
  let component: StorageSystemComponent;
  let fixture: ComponentFixture<StorageSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
