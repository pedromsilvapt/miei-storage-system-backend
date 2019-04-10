import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {PageModule} from './shared/page/page.module';
import {FoodssComponent} from './foodss/foodss.component';

@NgModule({
  declarations: [
    AppComponent,
    FoodssComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    PageModule,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
