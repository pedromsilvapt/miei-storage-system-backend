import {Injectable} from '@angular/core';
import {HttpService} from '../core/http/http.service';
import {Observable} from 'rxjs';
import {UserRegisterDTO} from './model/user-register.dto.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) { }

  public saveUser(user: UserRegisterDTO): Observable<any> {
    return this.httpService.post('user/register', JSON.stringify(user));
  }
}
