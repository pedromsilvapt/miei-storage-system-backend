import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {ListaComprasComponent} from './components/lista-compras/lista-compras.component';
import {InfoCardComponent} from './components/info-card/info-card.component';
import {SharedModule} from '../shared/shared.module';
import {ExpireDateTableComponent} from './components/expire-date-table/expire-date-table.component';
import { GraphComponent } from './components/graph/graph.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component'
import { ChartsModule } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    HomeComponent,
    ListaComprasComponent,
    InfoCardComponent,
    ExpireDateTableComponent,
    GraphComponent,
    PieChartComponent,
  ],
  imports: [
    CommonModule,
    ChartsModule,
    SharedModule,
    MatProgressSpinnerModule
  ]
})
export class HomeModule { }
