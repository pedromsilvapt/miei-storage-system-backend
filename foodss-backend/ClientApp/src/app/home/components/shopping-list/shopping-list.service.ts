import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '../../../core/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {

  constructor(private httpService: HttpService) {
  }

  public getShoppingListProducts(): Observable<any> {
    return this.httpService.get('shoppinglist/');
  }

  public updateShoppingListItemAmount(row: {id, count}): Observable<any> {
    return this.httpService.post('shoppinglist/update-shopping-list-item', {id: row.id, count: row.count});
  }

  public deleteShoppingListItem(id: number): Observable<any> {
    return this.httpService.delete('shoppinglist/' + id);
  }
}
