import {User} from '../../user/model/user.model';
import {Product} from '../../product/model/product.model';

export interface City {
  id: number;
  name: string;
  country: string;
}

export class StorageModel {
  id: number;
  name: string;
  shared: boolean;
  ownerId: number;
  cityId: number;
  city: City;
  products?: Array<Product>;
}
