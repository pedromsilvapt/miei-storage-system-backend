import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {StorageSystemComponent} from './storage-system/storage-system.component';
import {HomeRoutes} from './home/home.routes';
import {LoginRoutes} from './login/login.routes';
import {StorageRoutes} from './storage/storage.routes';
import {UserFormRoutes} from './user/form/user-form.routes';
import {ProductDetailRoutes} from './product/product.routes';

const routes: Routes = [
  {
    path: '', redirectTo: 'storage-system', pathMatch: 'full'
  },
  ...LoginRoutes,
  ...UserFormRoutes,
  {
    path: 'storage-system', component: StorageSystemComponent,
    data: {
      title: 'Home'
    },
    children: [
      ...HomeRoutes,
      ...StorageRoutes,
      ...ProductDetailRoutes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
