import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {User} from '../model/user.model';
import {StepperComponent} from '../components/stepper/stepper.component';
import {Language} from 'angular-l10n';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Language() lang: string;

  @ViewChild('formFirstStep') formFirstStep: any;
  @ViewChild('formSecondStep') formSecondStep: any;

  public user: User = new User();
  public nextButtonClicked = false;
  public invalidEmail = false;

  constructor() { }

  ngOnInit() {
  }

  callBackOnClickNextStepButton(event: {stepper: StepperComponent, activeStep: number}): void {
    this.nextButtonClicked = true;
    if (event.activeStep === 0) {
      this.validateFirstStep(event);
    }
  }

  private validateFirstStep(event: {stepper: StepperComponent, activeStep: number}): void {
    const formControls = this.formFirstStep.controls;
    if (formControls.name.valid === true && formControls.email.valid === true) {
      this.nextButtonClicked = false;
      this.invalidEmail = false;
      event.stepper.activateStep(event.activeStep + 1);
    }
  }

  private validateSecondStep(event: {stepper: StepperComponent, activeStep: number}): void {
    const formControls = this.formSecondStep.controls;
    if (formControls.username.valid === true && formControls.password.valid === true
      && formControls.confirmPassword.valid === true) {
      this.nextButtonClicked = false;
      this.submitForm(event);
    }
  }

  private submitForm(event: {stepper: StepperComponent, activeStep: number}): void {
    // TODO Submit on backend
    Promise.resolve(null).then(() => {
      console.log(this.user);
      event.stepper.activateStep(event.activeStep + 1);
    }).catch(() => {
      // TODO show error on toastr lib
    });
  }

  public callbackOnClickSubmitButton(event: {stepper: StepperComponent, activeStep: number}): void {
    this.nextButtonClicked = true;
    this.validateSecondStep(event);
  }

}
