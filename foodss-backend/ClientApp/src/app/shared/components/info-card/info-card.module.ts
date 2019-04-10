import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InfoCardComponent} from './info-card.component';
import {ChartsModule} from 'ng2-charts';
import {FormsModule} from '@angular/forms';
import {InfoCardService} from './info-card.service';
import {RouterModule} from '@angular/router';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  declarations: [InfoCardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    RouterModule,
    TranslationModule
  ],
  exports: [InfoCardComponent],
  providers: [InfoCardService]
})
export class InfoCardModule { }
