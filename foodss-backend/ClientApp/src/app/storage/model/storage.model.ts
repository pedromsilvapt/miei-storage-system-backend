import {User} from '../../user/model/user.model';
import {Product} from '../../product/model/product.model';

export class StorageModel {

  id: number;
  name: string;
  isShared: boolean;
  userOwner: User;
  products: Array<Product>;
}
