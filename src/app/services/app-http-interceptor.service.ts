import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AlertService, MessageSeverity } from './alert.service';
import { AccountService } from './account.service';
import { JsonresponseModel } from '../models/jsonresponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppHttpInterceptorService {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private accountService: AccountService,
    private router: Router,
    private alertService: AlertService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.headers.get('Content-Type') != 'multipart/form-data') {
      request.headers.append('Content-Type', 'application/json');//common contentType which require all request/ ignore to add this when found multipart-formdata      
    }

    if (request.headers.get('isthirdParty') != null) {
      console.log('authReq before');
      console.log(request.headers);

      request = request.clone({ headers: request.headers.delete('isthirdParty') })
      console.log('authReq after');
      console.log(request.headers);
    } else {
      //ignore headers when login or signup
      let isLogin = request.url.includes('/login')
        || request.url.includes('signup')
        || request.url.includes('inquiries/add')
        || request.url.includes('authenticate')
        || request.url.includes('signinwithgoogle')
        || request.url.includes('signupwithgoogle')
        || request.url.includes('resetpassword');
      console.log('isLogin');
      console.log(isLogin);

      if (!isLogin) {
        console.log("LOGIN ----------------------------------if")
        request = request.clone({
          headers: request.headers.append("Authorization", "Bearer ".concat(this.accountService.getToken()))
            //.append('companyid', this.commonservice.getcurrentCompanyIdstr())
            //.append('username', this.accountService.getName())
            .append('userid', this.accountService.getUserid())
          // .append('associateid',"1")
        });
      }
      else {
        console.log("LOGIN --------------------------else ")
        request = request.clone({
          headers: request.headers.append('userid', "0")
        });
      }
    }

    console.log('authReq:: rady to execute');
    console.log(request);

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse &&
        error.status === 401) {
        return this.handle401Error(request, next);
      }
      else {
        return throwError(error);
      }
    }));


    // // Add a custom header or modify the request
    // const clonedRequest = request.clone({
    //   setHeaders: {
    //     //Authorization: 'Bearer YOUR_TOKEN_HERE'
    //   }
    // });
    // console.error('clonedRequest', clonedRequest)
    // return next.handle(clonedRequest);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      let tokenmodel = this.accountService.getTokenModel();
      if (tokenmodel != null) {
        return this.accountService.refreshToken(tokenmodel).pipe(
          switchMap((result: JsonresponseModel) => {
            console.log("Error Occurred")

            this.isRefreshing = false;
            if (result.success == 1) {
              this.accountService.saveToken(result.data.token);
              this.accountService.saveRefreshToken(result.data.refreshtoken);
              return next.handle(this.addToken(request, result.data.token));
            }
            else if (result.success == 2) {

              this.accountService.logout();
              this.router.navigate(['login'])
                .then(() => {
                  this.alertService.showMessage("Message", result.message, MessageSeverity.error);
                });
              return EMPTY;
            } else {
              this.accountService.logout();
              this.router.navigate(['login'])
              return EMPTY;
            }
          }),
          catchError((err) => {
            console.log('err refresh token');
            console.log(err);
            this.isRefreshing = false;
            this.accountService.logout();
            this.router.navigate(['login'])
            return EMPTY;

          })
        );
      } else {
        this.accountService.logout();
        this.router.navigate(['login'])
        return EMPTY;
      }

    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(request, token)))
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

}

