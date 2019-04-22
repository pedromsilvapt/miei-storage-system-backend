import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StorageSystemComponent} from './storage-system/storage-system.component';
import {HomeRoutes} from './home/home.routes';
import {LoginRoutes} from './login/login.routes';
import {StorageRoutes} from './storage/storage.routes';
import {UserFormRoutes} from './user/form/user-form.routes';
import {ProductDetailRoutes} from './product/product.routes';
import {AddStorageRoutes} from './add-storage/add-storage.routes';
import {AuthGuard} from './login/auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'storage-system', pathMatch: 'full'
  },
  ...LoginRoutes,
  ...UserFormRoutes,
  {
    path: 'storage-system', component: StorageSystemComponent,
    // TODO uncomment line below to activate AuthGuard
    // canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      ...HomeRoutes,
      ...ProductDetailRoutes,
      ...StorageRoutes,
      ...AddStorageRoutes

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
