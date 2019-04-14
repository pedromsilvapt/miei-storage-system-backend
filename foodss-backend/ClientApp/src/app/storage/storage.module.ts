import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageComponent} from './storage.component';
import {SharedModule} from '../shared/shared.module';
import {StorageFormModule} from './form/storage-form.module';
import {StorageDatatableComponent} from './components/storage-datatable/storage-datatable.component';

@NgModule({
  declarations: [StorageComponent, StorageDatatableComponent],
  imports: [
    CommonModule,
    SharedModule,
    StorageFormModule
  ]
})
export class StorageModule { }
