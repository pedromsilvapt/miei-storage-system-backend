import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageComponent} from './storage.component';
import {SharedModule} from '../shared/shared.module';
import {StorageDatatableComponent} from '../shared/components/storage-datatable/storage-datatable.component';
import {StorageFormModule} from './form/storage-form.module';

@NgModule({
  declarations: [StorageComponent, StorageDatatableComponent],
  imports: [
    CommonModule,
    SharedModule,
    StorageFormModule
  ]
})
export class StorageModule { }
