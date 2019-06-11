import {User} from '../../user/model/user.model';

export class Product {

  id: number;
  name: string;
  barcode: string;
  maxTemperature?: number;
  // TODO analisar necessidade de atributo abaixo
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
