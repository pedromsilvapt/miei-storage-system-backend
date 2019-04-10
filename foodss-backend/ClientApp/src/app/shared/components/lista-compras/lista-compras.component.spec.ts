import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComprasComponent } from './lista-compras.component';

describe('ListaComprasComponent', () => {
  let component: ListaComprasComponent;
  let fixture: ComponentFixture<ListaComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
