import { Injectable } from '@angular/core';
import { HttpClientHelper } from '../Helper/http-client-helper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from './common.service';
import { EventmasterModel } from '../models/eventmaster';
import { ResponseModel } from '../models/response';
import { catchError, Observable, retry } from 'rxjs';
import { ClientmasterModel } from '../models/clientmaster';

@Injectable({
  providedIn: 'root'
})
export class EventmasterService {

  private apiUrl = HttpClientHelper.baseURL.concat("/eventParticipant")

  constructor(private http: HttpClient
    , private commonmasterService: CommonService) { }

  tokenIssueStatusUpdate(_obj: ClientmasterModel): Observable<ResponseModel> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<ResponseModel>(this.apiUrl.concat('/tokenIssueStatusUpdate'), _obj, httpOptions)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

  getList(_obj: ClientmasterModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.apiUrl.concat('/getList'), _obj)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

  eventGet(_obj: EventmasterModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.apiUrl.concat('/eventGet'), _obj)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

  getTokenIssuedStatus(_obj: ClientmasterModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.apiUrl.concat('/getTokenIssuedStatus'), _obj)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

  getTokenNotIssuedStatus(_obj: ClientmasterModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.apiUrl.concat('/getTokenNotIssuedStatus'), _obj)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

}
