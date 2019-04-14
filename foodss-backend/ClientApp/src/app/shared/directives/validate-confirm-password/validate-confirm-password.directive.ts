import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, NgModel, Validator} from '@angular/forms';

@Directive({
  selector: '[appValidateConfirmPassword]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateConfirmPasswordDirective,
    multi: true
  }]
})
export class ValidateConfirmPasswordDirective implements Validator {

  @Input('appValidateConfirmPassword') password: NgModel;

  constructor() { }

  validate(control: AbstractControl): {[key: string]: any} | null {
    return control.value === this.password.value ? null : {forbiddenConfirmPassword: true};
  }

}
