import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PageModule} from './shared/page/page.module';

import {StorageSystemComponent} from './storage-system/storage-system.component';
import {HomeModule} from './home/home.module';

import {L10nLoader, TranslationModule} from 'angular-l10n';
import {l10nConfig} from '../assets/locale/l10n-config';
import {HttpClientModule} from '@angular/common/http';
import {ModalModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    PageModule,
    HomeModule,
    HttpClientModule,
    TranslationModule.forRoot(l10nConfig),
    ModalModule.forRoot()
  ],
  declarations: [
    AppComponent,
    StorageSystemComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
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
