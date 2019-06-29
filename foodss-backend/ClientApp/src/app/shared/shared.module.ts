import {NgModule} from '@angular/core';
import {TranslationModule} from 'angular-l10n';
import {BsDropdownModule, TabsModule} from 'ngx-bootstrap';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SharedComponentsModule} from './components/shared-components.module';
import {SharedDirectivesModule} from './directives/shared-directives.module';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MessageUtil} from './util/message.util';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChartModule} from 'angular-highcharts';

@NgModule({
  declarations: [],
  imports: [],
  providers: [MessageUtil],
  exports: [
    BrowserAnimationsModule,
    BsDropdownModule,
    ChartModule,
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
