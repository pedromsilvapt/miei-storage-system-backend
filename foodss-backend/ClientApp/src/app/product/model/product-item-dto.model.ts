import {User} from '../../user/model/user.model';

export class ProductItemDTO {
  id: number;
  expiryDate: Date;
  addedDate: Date;
  productName: string;
  productId: number;
  storageId: number;
  consumedDate: Date;
  owner: User;
}
