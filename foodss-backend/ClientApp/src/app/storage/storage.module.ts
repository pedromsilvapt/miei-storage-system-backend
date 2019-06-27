import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageComponent} from './storage.component';
import {SharedModule} from '../shared/shared.module';
import {StorageFormModule} from './form/storage-form.module';
import { StorageDatatableComponent } from './components/storage-datatable/storage-datatable.component';
import { AddProductModalComponent } from './components/add-product-modal/add-product-modal.component'
import { MinDateValidatorDirective } from './components/add-product-modal/min-date.directive';
import { BarcodeScannerComponent } from './components/add-product-modal/barcode-scanner.component';
import { DetailsProductModalComponent } from './components/details-product-modal/details-product-modal.component';
import {StorageDetailComponent} from './detail/storage-detail.component';

@NgModule({
  declarations: [
    StorageComponent,
    StorageDatatableComponent,
    MinDateValidatorDirective,
    AddProductModalComponent,
    BarcodeScannerComponent,
    DetailsProductModalComponent,
    StorageDetailComponent,
  ],
  entryComponents: [AddProductModalComponent, DetailsProductModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    StorageFormModule
  ]
})
export class StorageModule { }
