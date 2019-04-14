import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
  selector: '[appValidateEmail]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateEmailDirective,
    multi: true
  }]
})
export class ValidateEmailDirective implements Validator {

  private emailRegex: RegExp = new RegExp('' +
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/.source
    + /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source);


  constructor() { }

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.emailRegex.test(control.value) ? null : {forbiddenEmail: true};
  }

}
