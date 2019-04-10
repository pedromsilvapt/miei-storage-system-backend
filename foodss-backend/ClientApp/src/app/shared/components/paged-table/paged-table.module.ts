import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagedTableComponent} from './paged-table.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [PagedTableComponent],
  imports: [
    CommonModule,
    NgxDatatableModule
  ],
  exports: [PagedTableComponent]
})
export class PagedTableModule { }
