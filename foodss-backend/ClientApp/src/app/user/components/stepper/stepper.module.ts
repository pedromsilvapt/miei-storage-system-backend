import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StepperComponent} from './stepper.component';
import {StepComponent} from './step/step.component';
import {EmptyCircleDirective} from './directives/empty-circle/empty-circle.directive';
import {FilledCircleDirective} from './directives/filled-circle/filled-circle.directive';
import {LineSeparatorDirective} from './directives/line-separator/line-separator.directive';
import {TranslationModule} from 'angular-l10n';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    StepperComponent,
    StepComponent,
    EmptyCircleDirective,
    FilledCircleDirective,
    LineSeparatorDirective,
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
