import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageComponent} from './storage.component';
import {SharedModule} from '../shared/shared.module';
import {StorageFormModule} from './form/storage-form.module';
import { StorageDatatableComponent } from './components/storage-datatable/storage-datatable.component';
import { AddProductModalComponent } from './components/add-product-modal/add-product-modal.component'
import { MinDateValidatorDirective } from './components/add-product-modal/min-date.directive';

@NgModule({
  declarations: [StorageComponent, StorageDatatableComponent, MinDateValidatorDirective, AddProductModalComponent],
  entryComponents: [AddProductModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    StorageFormModule
  ]
})
export class StorageModule { }
