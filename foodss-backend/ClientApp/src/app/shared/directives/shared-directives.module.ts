import {NgModule} from '@angular/core';
import {ValidateEmailDirective} from './validate-email/validate-email.directive';
import {ValidateConfirmPasswordDirective} from './validate-confirm-password/validate-confirm-password.directive';
import {ExpireDateDirective} from './expire-date/expire-date.directive';

@NgModule({
  declarations: [
    ValidateEmailDirective,
    ValidateConfirmPasswordDirective,
    ExpireDateDirective
  ],
  imports: [],
  exports: [
    ValidateEmailDirective,
    ValidateConfirmPasswordDirective,
    ExpireDateDirective
  ]
})
export class SharedDirectivesModule { }
