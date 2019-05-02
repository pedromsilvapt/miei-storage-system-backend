import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {ListaComprasComponent} from './components/lista-compras/lista-compras.component';
import {InfoCardComponent} from './components/info-card/info-card.component';
import {SharedModule} from '../shared/shared.module';
import {ExpireDateTableComponent} from './components/expire-date-table/expire-date-table.component'
@NgModule({
  declarations: [
    HomeComponent,
    ListaComprasComponent,
    InfoCardComponent,
    ExpireDateTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomeModule { }
