import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoCardService {

  constructor() { }

  public getProductsOnStock(): number {
    // TODO
    return 94;
  }

  public getProductsNearExpirationDate(): number {
    // TODO
    return 32;
  }

  public getProductsNearToEnd(): number {
    // TODO
    return 20;
  }

  public getProductsConsumedThisMonth(): number {
    // TODO
    return 26;
  }
}
