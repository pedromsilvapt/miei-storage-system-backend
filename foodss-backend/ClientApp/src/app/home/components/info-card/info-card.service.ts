import {Injectable} from '@angular/core';
import {HttpService} from '../../../core/http/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoCardService {

  constructor(private httpService: HttpService) { }

  public getProductsOnStock(): Observable<any> {
    return this.httpService.get('productitem/amount');
  }

  public getProductsExpiring(): Observable<any> {
    return this.httpService.get('productitem/amount-expiring');
  }

  public getProductsExpired(): Observable<any> {
    return this.httpService.get('productitem/amount-expired');
  }

  public getProductsConsumedThisMonth(): number {
    // TODO
    return 26;
  }
}
