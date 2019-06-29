import {Routes} from '@angular/router';
import {StorageComponent} from './storage.component';
import {StorageFormComponent} from './form/storage-form.component';
import {StorageDetailComponent} from './detail/storage-detail.component';

export const StorageRoutes: Routes = [
  {
    path: 'storage', component: StorageComponent,
  },
  {
    path: 'storage/add-storage', component: StorageFormComponent
  },
  {
    path: 'storage/:idStorage/:idProduct', component: StorageDetailComponent,
  }
];
