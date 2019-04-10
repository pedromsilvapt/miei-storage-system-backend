import {User} from '../../user/model/user.model';

export class Product {

  id: number;
  name: string;
  amount: number;
  barCode: string;
  hasExpireDate: boolean;
  // TODO analisar necessidade de atributo abaixo
  // storage: StorageModel;
  userOwner: User;
  isShared: boolean;
  expireDate: Date;
  addedDate: Date;
  consumedDate: Date;
}
