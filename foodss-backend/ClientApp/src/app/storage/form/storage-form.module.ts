import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageFormComponent} from './storage-form.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [StorageFormComponent],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class StorageFormModule { }
