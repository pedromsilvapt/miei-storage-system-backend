import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { StorageSystemComponent } from './storage-system/storage-system.component';
import {HomeRoutes} from './home/home.routes';

const routes: Routes = [
  {
    path: '', redirectTo: 'storage-system', pathMatch: 'full'
  },
  {
    path: 'storage-system', component: StorageSystemComponent,
    data: {
      title: 'Home'
    },
    children: [
      ...HomeRoutes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
