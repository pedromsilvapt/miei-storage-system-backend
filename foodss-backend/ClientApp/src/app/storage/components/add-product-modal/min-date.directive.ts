import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[minDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinDateValidatorDirective, multi: true }]
})
export class MinDateValidatorDirective implements Validator {
  @Input('minDate') minDate: Date;

  protected test(dateStr: string): { [key: string]: any } | null {
    if (this.minDate == null || dateStr == null) {
      return null;
    }

    const date = new Date(dateStr);

    console.log(this.minDate, date);

    const valid = date.getTime() >= this.minDate.getTime();

    return valid ? null : { 'minDate': { value: date } };
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.minDate ? this.test(control.value)
      : null;
  }
}
