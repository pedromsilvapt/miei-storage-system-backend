import {NgModule} from '@angular/core';
import {TranslationModule} from 'angular-l10n';
import {PanelModule} from './components/panel/panel.module';
import {BsDropdownModule, TabsModule} from 'ngx-bootstrap';
import {CustomDatatableModule} from './components/custom-datatable/custom-datatable.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    BsDropdownModule,
    PanelModule,
    TranslationModule,
    CustomDatatableModule,
    RouterModule,
    TabsModule,
  ],
  exports: [
    PanelModule,
    CustomDatatableModule,
    TabsModule,
    TranslationModule,
    RouterModule
  ]
})
export class SharedModule { }
