import {User} from '../../user/model/user.model';
import {Product} from '../../product/model/product.model';

export class StorageModel {
  id: number;
  name: string;
  shared: boolean;
  ownerId: number;
  products?: Array<Product>;
}
