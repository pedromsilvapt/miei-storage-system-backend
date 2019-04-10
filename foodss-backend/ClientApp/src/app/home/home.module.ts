import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {ListaComprasComponent} from '../shared/components/lista-compras/lista-compras.component';
import {InfoCardComponent} from '../shared/components/info-card/info-card.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    ListaComprasComponent,
    InfoCardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomeModule { }
