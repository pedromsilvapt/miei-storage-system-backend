import {User} from '../../user/model/user.model';

export class Product {

  id: number;
  name: string;
  barcode: string;
  maxTemperature?: number;
  // storage: StorageModel;
  storageId: number;
  userOwner: User;

  count?: number;
  closestExpiryDate?: Date;
  sharedCount?: number;
  sharedClosestExpiryDate?: Date;
  privateCount?: number;
  privateClosestExpiryDate?: Date;
  addedDate: Date;
  consumedDate?: Date;
}
