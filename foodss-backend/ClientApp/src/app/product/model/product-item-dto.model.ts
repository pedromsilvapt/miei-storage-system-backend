import {User} from '../../user/model/user.model';

export class ProductItemDTO {
  id: number;
  expiryDate: Date;
  productName: string;
  productId: number;
  storageId: number;
  owner: User;
}
