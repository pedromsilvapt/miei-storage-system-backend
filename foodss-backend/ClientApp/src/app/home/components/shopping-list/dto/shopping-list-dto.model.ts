export class ShoppingListDTO {
  id: number;
  idUser: number;
  idProduct: number;
  count: number;
  productName: string;
  StorageName: string;

  constructor(id, idUser, idProduct, count, productName, StorageName) {
    this.idUser = idUser;
    this.idProduct = idProduct;
    this.count = count;
    this.productName = productName;
    this.StorageName = StorageName;
  }
}
