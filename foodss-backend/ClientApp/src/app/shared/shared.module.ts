import {NgModule} from '@angular/core';
import {TranslationModule} from 'angular-l10n';
import {BsDropdownModule, TabsModule} from 'ngx-bootstrap';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SharedComponentsModule} from './components/shared-components.module';
import {SharedDirectivesModule} from './directives/shared-directives.module';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    BsDropdownModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    TabsModule,
    TranslationModule,
    SharedComponentsModule,
    SharedDirectivesModule
  ],
  exports: [
    BsDropdownModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    TabsModule,
    TranslationModule,
    SharedComponentsModule,
    SharedDirectivesModule
  ]
})
export class SharedModule { }
