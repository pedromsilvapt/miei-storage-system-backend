import {Routes} from '@angular/router';
import {ProductComponent} from './product.component';

export const ProductDetailRoutes: Routes = [
  { path: 'product/:id', component: ProductComponent }
];
