import {Injectable} from '@angular/core';
import {HttpService} from '../core/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor(private httpService: HttpService) {
  }

}
