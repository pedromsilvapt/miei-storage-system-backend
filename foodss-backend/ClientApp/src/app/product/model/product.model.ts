import {StorageModel} from '../../storage/model/storage.model';
import {User} from '../../user/model/user.model';

export class Product {

  id: number;
  name: string;
  amount: number;
  barCode: string;
  hasExpireDate: boolean;
  storage: StorageModel;
  ownwer: User;
  isShared: boolean;
  expireDate: Date;
  addedDate: Date;
  consumedDate: Date;


}
