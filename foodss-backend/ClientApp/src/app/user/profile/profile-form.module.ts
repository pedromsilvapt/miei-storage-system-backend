import {NgModule} from '@angular/core';
import {ProfileFormComponent} from './profile-form.component';
import {SharedModule} from '../../shared/shared.module';
import {StepperModule} from '../components/stepper/stepper.module';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  declarations: [ProfileFormComponent],
  imports: [
    StepperModule,
    TranslationModule,
    SharedModule,
  ]
})
export class ProfileFormModule { }
