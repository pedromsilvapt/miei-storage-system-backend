import {NgModule} from '@angular/core';
import {ValidateEmailDirective} from './validate-email/validate-email.directive';
import {ValidateConfirmPasswordDirective} from './validate-confirm-password/validate-confirm-password.directive';

@NgModule({
  declarations: [
    ValidateEmailDirective,
    ValidateConfirmPasswordDirective,
  ],
  imports: [],
  exports: [
    ValidateEmailDirective,
    ValidateConfirmPasswordDirective,
  ]
})
export class SharedDirectivesModule { }
