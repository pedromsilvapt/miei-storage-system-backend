import {User} from '../../user/model/user.model';
import {environment} from '../../../environments/environment';

export class AuthenticationUtil {

  public static getUserFromSession(): User {
    return JSON.parse(localStorage.getItem(environment.userSession));
  }
}
