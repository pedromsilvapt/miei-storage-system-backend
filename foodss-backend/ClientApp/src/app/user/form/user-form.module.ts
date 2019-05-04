import {NgModule} from '@angular/core';
import {UserFormComponent} from './user-form.component';
import {SharedModule} from '../../shared/shared.module';
import {StepperModule} from '../components/stepper/stepper.module';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    StepperModule,
    TranslationModule,
    SharedModule,
  ]
})
export class UserFormModule { }
