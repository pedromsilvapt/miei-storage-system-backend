import {Routes} from '@angular/router';
import {StorageComponent} from './storage.component';
import {StorageFormComponent} from './form/storage-form.component';

export const StorageRoutes: Routes = [
  {
    path: 'storage', component: StorageComponent,
  },
  {
    path: 'storage/form', component: StorageFormComponent
  }
];
