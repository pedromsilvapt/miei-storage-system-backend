import {User} from '../../user/model/user.model';
import { ProductItemDTO } from './product-item-dto.model';
import { StorageModel } from '../../storage/model/storage.model';

export class Product {

  id: number;
  name: string;
  barcode: string;
  maxTemperature?: number;
  storage?: StorageModel;
  storageId: number;
  userOwner: User;
  products: Array<ProductItemDTO>;
  count?: number;
  closestExpiryDate?: Date;
  sharedCount?: number;
  sharedClosestExpiryDate?: Date;
  privateCount?: number;
  privateClosestExpiryDate?: Date;
  addedDate: Date;
  consumedDate?: Date;
}
