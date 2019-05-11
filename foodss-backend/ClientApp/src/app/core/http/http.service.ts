import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {Observable, Subject} from 'rxjs';
import {HttpUtil} from './http.util';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient, private router: Router, private slimLoadingBarService: SlimLoadingBarService) {
  }

  public post(url: string, parameters: any): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      this.initializeSlimLoadingBar();
      this.httpClient.post(HttpUtil.url(url), parameters, HttpUtil.headers())
        .pipe(catchError(HttpUtil.processError))
        .subscribe(data => {
            this.executeOnResponseSuccess(observer, data);
          },
          error => {
            this.executeOnResponseError(observer, error);
          });
    });
  }

  public get(url: string, options ?: any): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      this.initializeSlimLoadingBar();
      this.httpClient.get(HttpUtil.url(url), { ...options, ...HttpUtil.headers() })
        .pipe(catchError(HttpUtil.processError))
        .subscribe(data => {
            this.executeOnResponseSuccess(observer, data);
          },
          error => {
            this.executeOnResponseError(observer, error);
          });
    });
  }

  public put(url: string, parameters: any): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      this.initializeSlimLoadingBar();
      this.httpClient.put(HttpUtil.url(url), parameters, HttpUtil.headers())
        .pipe(catchError(HttpUtil.processError))
        .subscribe(data => {
            this.executeOnResponseSuccess(observer, data);
          },
          error => {
            this.executeOnResponseError(observer, error);
          });
    });
  }

  public delete(url: string): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      this.initializeSlimLoadingBar();
      this.httpClient.delete(HttpUtil.url(url), HttpUtil.headers())
        .pipe(catchError(HttpUtil.processError))
        .subscribe(data => {
            this.executeOnResponseSuccess(observer, data);
          },
          error => {
            this.executeOnResponseError(observer, error);
          });
    });
  }

  // TODO processError
  private checkAuthenticationValidity(error) {
    if (error.status === 401) {
      localStorage.clear();
      this.router.navigateByUrl('/login');
    }
  }

  private executeOnResponseError(observer: Subject<any>, error): void {
    this.slimLoadingBarService.complete();
    this.checkAuthenticationValidity(error);
    observer.error(error);
    observer.complete();
  }

  private executeOnResponseSuccess(observer: Subject<any>, data): void {
    this.slimLoadingBarService.complete();
    observer.next(data);
    observer.complete();
  }

  private initializeSlimLoadingBar(): void {
    this.slimLoadingBarService.progress = 30;
    this.slimLoadingBarService.start();
  }
}
