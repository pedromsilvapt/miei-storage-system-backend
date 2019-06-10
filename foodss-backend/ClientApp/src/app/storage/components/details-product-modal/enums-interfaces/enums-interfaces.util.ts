export enum DetailsProductPage {
  Items = 'items',
  ShoppingList = 'shopping-list',
  Consumed = 'consumed'
}

export enum ProductExpiryLevel {
  Expired = 'expired',
  Close = 'close',
  Distant = 'distant'
}

export interface ProductItem {
  id: number;
  productId: number;
  ownerId: number;
  shared: boolean;
  expiryDate: Date;
  addedDate: Date;
}

export interface ProductItemAggregate {
  count: number;
  shared: boolean;
  expiryDate: Date;
  expiryDateLabel: string;
  expiryLevel: ProductExpiryLevel;
  remainingDays: number;
  ids: number[];
}

export interface EditingProductItemAggregate extends ProductItemAggregate {
  originalCount?: number;
}

export interface ConsumedProductItem extends ProductItem {
  remainingDays?: number;
  expiryDateLabel?: string;

  consumedDate: Date;
  consumedDateLabel?: string;
  consumedDateDays?: number;
}
