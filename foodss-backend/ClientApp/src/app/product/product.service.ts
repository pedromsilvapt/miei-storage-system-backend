import {Injectable} from '@angular/core';
import {HttpService} from '../core/http/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpService: HttpService) {
  }

  public getProductsNearExpiringDate(): Observable<any> {
    return this.httpService.get('productitem/near-expiring-date');
  }

  public deleteProductItem(storageId: number, productId: number, id: number): Observable<any> {
    return this.httpService.delete('storage/' + storageId + '/product/' + productId + '/item/' + id);
  }
}
