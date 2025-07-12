import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientHelper } from '../Helper/http-client-helper';
import { CommonService } from './common.service';
import { UsermasterModel } from '../models/usermaster';
import { catchError, Observable, retry } from 'rxjs';
import { ResponseModel } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class UsermasterService {

  private apiUrl = HttpClientHelper.baseURL.concat("/user")

  constructor(private http: HttpClient
    , private commonmasterService: CommonService) { }

  login(_obj: UsermasterModel): Observable<ResponseModel> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<ResponseModel>(this.apiUrl.concat('/login'), _obj, httpOptions)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

}
