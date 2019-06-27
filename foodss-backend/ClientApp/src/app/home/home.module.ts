import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {ShoppingListComponent} from './components/shopping-list/shopping-list.component';
import {InfoCardComponent} from './components/info-card/info-card.component';
import {SharedModule} from '../shared/shared.module';
import {ExpireDateTableComponent} from './components/expire-date-table/expire-date-table.component';
import { GraphComponent } from './components/graph/graph.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component'
import { ChartsModule } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    HomeComponent,
    ShoppingListComponent,
    InfoCardComponent,
    ExpireDateTableComponent,
    GraphComponent,
    PieChartComponent,
  ],
  imports: [
    CommonModule,
    ChartsModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class HomeModule { }
