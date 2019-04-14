import {NgModule} from '@angular/core';
import {PanelComponent} from './panel/panel.component';
import {InputErrorsComponent} from './input-errors/input-errors.component';
import {LanguageSelectorComponent} from './language-selector/language-selector.component';
import {CustomDatatableModule} from './custom-datatable/custom-datatable.module';
import {CommonModule} from '@angular/common';
import {TranslationModule} from 'angular-l10n';
import {BsDropdownModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    InputErrorsComponent,
    LanguageSelectorComponent,
    PanelComponent
  ],
  imports: [
    BsDropdownModule,
    CommonModule,
    CustomDatatableModule,
    TranslationModule
  ],
  exports: [
    CustomDatatableModule,
    InputErrorsComponent,
    LanguageSelectorComponent,
    PanelComponent
  ]
})
export class SharedComponentsModule { }
