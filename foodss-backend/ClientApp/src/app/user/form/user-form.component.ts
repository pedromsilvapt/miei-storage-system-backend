import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../model/user.model';
import {StepperComponent} from '../components/stepper/stepper.component';
import {Language} from 'angular-l10n';
import {UserRegisterDTO} from '../model/user-register.dto.model';
import {UserService} from '../user.service';
import {MessageUtil} from '../../shared/util/message.util';

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
  public existingEmails: Array<string> = [];

  constructor(private userService: UserService, private messageUtil: MessageUtil) { }

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
    if (formControls.password.valid === true && formControls.confirmPassword.valid === true) {
      this.nextButtonClicked = false;
      this.submitForm(event);
    }
  }

  private submitForm(event: {stepper: StepperComponent, activeStep: number}): void {
    const userRegisterDTO: UserRegisterDTO = new UserRegisterDTO(this.user.name, this.user.email, this.user.password);
    this.userService.saveUser(userRegisterDTO).subscribe(() => {
      event.stepper.activateStep(event.activeStep + 1);
    }, error => {
      this.formSecondStep.resetForm();
      if (error.message === 'error.EMAIL_ALREADY_INFORMED') {
        event.stepper.activateStep(event.activeStep - 1);
        const inputEmailValue = this.formFirstStep.controls.email.value;
        if (this.existingEmails.indexOf(inputEmailValue) <= -1) {
          this.existingEmails.push(this.formFirstStep.controls.email.value);
        }
        this.messageUtil.addErrorMessage('general.user', error.message);
      } else {
        this.messageUtil.addErrorMessage('general.user', error.message);
      }
    });
  }

  public callbackOnClickSubmitButton(event: {stepper: StepperComponent, activeStep: number}): void {
    this.nextButtonClicked = true;
    this.validateSecondStep(event);
  }

}
