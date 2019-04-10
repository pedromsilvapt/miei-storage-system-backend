import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserFormComponent} from './user-form.component';
import {FormsModule} from '@angular/forms';
import {PanelModule} from '../../shared/components/panel/panel.module';

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
  ]
})
export class UserFormModule { }
