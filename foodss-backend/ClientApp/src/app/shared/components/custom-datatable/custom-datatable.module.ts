import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomDatatableComponent} from './custom-datatable.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SelectModule} from 'ng2-select';
import {TranslationModule} from 'angular-l10n';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [CustomDatatableComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    SelectModule,
    TranslationModule,
    RouterModule
  ],
  exports: [CustomDatatableComponent]
})
export class CustomDatatableModule { }