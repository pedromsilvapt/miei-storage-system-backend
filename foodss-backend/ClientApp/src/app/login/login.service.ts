import { Injectable } from '@angular/core';
import {HttpService} from '../core/http/http.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {User} from '../user/model/user.model';
import {MessageUtil} from '../shared/util/message.util';
import {isNullOrUndefined} from '@swimlane/ngx-datatable/release/utils';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  onLogin: BehaviorSubject<User> = new BehaviorSubject(null);
  constructor(private httpService: HttpService, private router: Router, private messageUtil: MessageUtil) {
    this.onLogin.next(JSON.parse(localStorage.getItem(environment.userSession)));
  }

  public signIn(email: string, password: string): void {
    this.httpService.post('user/authenticate', {email, password})
      .subscribe(response => {
        console.log(response);
        localStorage.setItem(environment.userToken, response.token);
        localStorage.setItem(environment.userSession, JSON.stringify(this.createUserSession(response)));
        this.router.navigateByUrl('/storage-system');

        this.onLogin.next(response);
      }, error => {
        password = '';
        this.messageUtil.addErrorMessage('general.login', error.message);
      });
  }

  public signOut(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
    this.onLogin.next(null);
  }

  public isLoggedIn(): boolean {
    return !isNullOrUndefined(localStorage.getItem(environment.userToken));
  }

  private createUserSession(response: any): User {
    const user: User = new User();
    user.id = response.id;
    user.name = response.name;
    user.email = response.email;
    return user;
  }
}
