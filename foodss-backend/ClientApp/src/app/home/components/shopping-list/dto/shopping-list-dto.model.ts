export class ShoppingListDTO {
  id: number;
  idUser: number;
  idProduct: number;
  count: number;
  productName: string;
  StorageName: string;
  idStorage: number;

  constructor(id: number, idUser: number, idProduct: number, count: number,
              productName: string, StorageName: string, idStorage: number) {
    this.id = id;
    this.idUser = idUser;
    this.idProduct = idProduct;
    this.count = count;
    this.productName = productName;
    this.StorageName = StorageName;
    this.idStorage = idStorage;
  }
}
