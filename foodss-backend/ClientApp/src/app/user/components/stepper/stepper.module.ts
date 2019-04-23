import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StepperComponent} from './stepper.component';
import {StepComponent} from './step/step.component';
import {LineSeparatorDirective} from './directives/line-separator/line-separator.directive';
import {TranslationModule} from 'angular-l10n';
import {RouterModule} from '@angular/router';
import { CircleStepDirective } from './directives/circle-step/circle-step.directive';

@NgModule({
  declarations: [
    StepperComponent,
    StepComponent,
    LineSeparatorDirective,
    CircleStepDirective,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    RouterModule
  ],
  exports: [
    StepperComponent,
    StepComponent
  ]
})
export class StepperModule { }
