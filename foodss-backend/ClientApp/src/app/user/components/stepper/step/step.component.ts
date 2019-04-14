import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html'
})
export class StepComponent implements OnInit {

  active: boolean;

  @Input() iconClass: string;

  constructor() { }

  ngOnInit() {
    this.active = false;
  }

  activateComponent() {
    this.active = true;
  }

  deactivateComponent() {
    this.active = false;
  }

}
