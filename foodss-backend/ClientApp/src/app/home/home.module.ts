import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './home.component';
import {BsDropdownModule} from 'ngx-bootstrap';
import {InfoCardModule} from '../shared/components/info-card/info-card.module';
import {PanelModule} from '../shared/components/panel/panel.module';
import {PagedTableModule} from '../shared/components/paged-table/paged-table.module';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    BsDropdownModule,
    InfoCardModule,
    PanelModule,
    PagedTableModule,
  ]
})
export class HomeModule { }
