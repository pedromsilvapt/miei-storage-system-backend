import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PageModule} from './shared/page/page.module';

import {StorageSystemComponent} from './storage-system/storage-system.component';

import {L10nLoader, TranslationModule} from 'angular-l10n';
import {l10nConfig} from '../assets/locale/l10n-config';
import {HttpClientModule} from '@angular/common/http';
import {ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {StorageSystemModule} from './storage-system/storage-system.module';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import {ToastrModule} from 'ngx-toastr';
import {Chart} from 'chart.js';
import {AvatarModule} from 'ngx-avatar';
import {ChartModule} from 'angular-highcharts';
import {UrlSerializer} from '@angular/router';
import CustomUrlSerializer from './core/util/custom-url-serializer';

const avatarColors = ['#2c3e50'];

@NgModule({
  imports: [
    ChartModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    PageModule,
    StorageSystemModule,
    AvatarModule.forRoot({
      colors: avatarColors
    }),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    TranslationModule.forRoot(l10nConfig)
  ],
  declarations: [
    AppComponent,
    StorageSystemComponent,
    // ExpireDateTableComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  exports: [
    TranslationModule
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(public l10nLoader: L10nLoader) {
    this.l10nLoader.load();
  }
}
