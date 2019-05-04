import {environment} from '../../../environments/environment';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';
import {HttpErrorModel} from './http-error.model';

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
      headerParams.Authorization = 'Bearer ' + token;
    }
    return {headers: new HttpHeaders(headerParams)};
  }

  public static processError(error: HttpErrorResponse) {
    let errorMessage: string;
    console.log(error);
    if (error.error instanceof ProgressEvent) {
      errorMessage = 'error.FAILED_TO_CONNECT_TO_SERVER';
      return throwError(new HttpErrorModel(error.status, errorMessage));
    } else if (error.status === 404) {
      errorMessage = 'error.API_ENDPOINT_NOT_FOUND';
      return throwError(new HttpErrorModel(error.status, errorMessage));
    } else if (error.status === 500) {
      errorMessage = 'error.SERVER_INTERNAL_ERROR';
      return throwError(new HttpErrorModel(error.status, errorMessage));
    } else {
      return throwError(new HttpErrorModel(error.status, 'error.' + error.error.error));
    }
  }
}
