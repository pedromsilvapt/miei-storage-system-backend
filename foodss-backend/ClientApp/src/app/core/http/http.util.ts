import {environment} from '../../../environments/environment';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';

export class HttpUtil {

  public static url(path: string): string {
    return environment.api + path;
  }

  public static headers() {
    const headerParams = {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
      Authorization: ''
    };
    const token: string = localStorage.getItem(environment.userToken);
    if (token) {
      headerParams.Authorization = 'Bearer' + token;
    }
    return {headers: new HttpHeaders(headerParams)};
  }

  public static processError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
