import {User} from '../../user/model/user.model';

export class Product {

  id: number;
  name: string;
  count: number;
  barcode: string;
  // TODO analisar necessidade de atributo abaixo
  // storage: StorageModel;
  storageId: number;
  userOwner: User;
  shared: boolean;
  closestExpiryDate: Date;
  addedDate: Date;
  consumedDate?: Date;
}
