import {Component, Input, OnInit} from '@angular/core';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-input-errors',
  templateUrl: './input-errors.component.html'
})
export class InputErrorsComponent implements OnInit {

  constructor() { }

  @Input() input: NgModel;
  @Input() validate: boolean;

  ngOnInit() {
  }

}
