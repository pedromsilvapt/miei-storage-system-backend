import {NgModule} from '@angular/core';
import {UserFormComponent} from './user-form.component';
import {SharedModule} from '../../shared/shared.module';
import {StepperModule} from '../components/stepper/stepper.module';

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    StepperModule,
    SharedModule,
  ]
})
export class UserFormModule { }
