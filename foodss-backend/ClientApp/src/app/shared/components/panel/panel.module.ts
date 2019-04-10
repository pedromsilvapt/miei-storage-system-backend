import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PanelComponent} from './panel.component';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  declarations: [PanelComponent],
  imports: [
    CommonModule,
    TranslationModule
  ],
  exports: [PanelComponent]
})
export class PanelModule { }
