import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FoodssComponent} from './foodss/foodss.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'foodss', pathMatch: 'full'
  },
  {
    path: 'foodss', component: FoodssComponent,
    data: {
      title: 'Home'
    },
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
