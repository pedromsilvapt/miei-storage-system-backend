import {Component, ContentChildren, ElementRef, EventEmitter, Input, OnInit, Output, QueryList} from '@angular/core';
import {StepComponent} from './step/step.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html'
})
export class StepperComponent implements OnInit {

  circleSize = 30;
  steps: QueryList<StepComponent>;

  activeStep: number;

  @Input() padding = 5;
  @Input() titleLastStepButton = 'form.back';
  @Input() routerLinkLastStepButton: string;
  @Output() clickNextStepButton: EventEmitter<any> = new EventEmitter();
  @Output() clickSubmitButton: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    Promise.resolve(null).then(() => {
      this.activateStep(0);
    });
  }

  onClickNextStepButtonEvent(): void {
    this.clickNextStepButton.next({stepper: this, activeStep: this.activeStep});
  }

  onClickSubmitButtonEvent(): void {
    this.clickSubmitButton.next({stepper: this, activeStep: this.activeStep});
  }

  @ContentChildren(StepComponent)
  set stepsImplemented(val: QueryList<StepComponent>) {
    this.steps = val;
  }

  get stepsImplemented(): QueryList<StepComponent> {
    return this.steps;
  }

  activateStep(stepIndex: number) {
    this.stepsImplemented.forEach((step, index) => {
      step.deactivateComponent();
      if (stepIndex === index) {
        step.activateComponent();
        this.activeStep = stepIndex;
      }
    });
  }

}
