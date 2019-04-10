import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './home.component';
import {BsDropdownModule} from 'ngx-bootstrap';
import {InfoCardModule} from '../components/info-card/info-card.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    BsDropdownModule,
    InfoCardModule
  ]
})
export class HomeModule { }
