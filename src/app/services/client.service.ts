import { Injectable } from '@angular/core';
import { HttpClientHelper } from '../Helper/http-client-helper';
import { CommonService } from './common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClientmasterModel } from '../models/clientmaster';
import { catchError, Observable, retry } from 'rxjs';
import { ResponseModel } from '../models/response';
import { OtpManagerModel } from '../models/otpmanager';
import { EventmasterModel } from '../models/eventmaster';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = HttpClientHelper.baseURL.concat("/eventRegistration")

  constructor(private http: HttpClient
    , private commonmasterService: CommonService) { }

  generateEmailOTP(_obj: OtpManagerModel): Observable<ResponseModel> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<ResponseModel>(this.apiUrl.concat('/generateEmailOTP'), _obj, httpOptions)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

  verifyEmailOTP(_obj: OtpManagerModel): Observable<ResponseModel> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<ResponseModel>(this.apiUrl.concat('/verifyEmailOTP'), _obj, httpOptions)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

  generateMobileOTP(_obj: OtpManagerModel): Observable<ResponseModel> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<ResponseModel>(this.apiUrl.concat('/generateMobileOTP'), _obj, httpOptions)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

  verifyMobileOTP(_obj: OtpManagerModel): Observable<ResponseModel> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<ResponseModel>(this.apiUrl.concat('/verifyMobileOTP'), _obj, httpOptions)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

  add(_obj: ClientmasterModel): Observable<ResponseModel> {
    //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<ResponseModel>(this.apiUrl.concat('/add'), _obj)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

  // getList(_obj: ClientmasterModel): Observable<ResponseModel> {
  //   return this.http.post<ResponseModel>(this.apiUrl.concat('/getList'), _obj)
  //     .pipe(
  //       retry(1)
  //       , catchError(this.commonmasterService.handleError)
  //     );
  // }

 

  

}
