import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {BsDropdownModule} from 'ngx-bootstrap';
import {InfoCardModule} from '../shared/components/info-card/info-card.module';
import {PanelModule} from '../shared/components/panel/panel.module';
import {CustomDatatableModule} from '../shared/components/custom-datatable/custom-datatable.module';
import {ListaComprasComponent} from '../shared/components/lista-compras/lista-compras.component';

@NgModule({
  declarations: [HomeComponent, ListaComprasComponent],
  imports: [
    CommonModule,
    BsDropdownModule,
    InfoCardModule,
    PanelModule,
    CustomDatatableModule,
  ]
})
export class HomeModule { }
