import { Injectable } from '@angular/core';
import { HttpClientHelper } from '../Helper/http-client-helper';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { EventmasterModel } from '../models/eventmaster';
import { ResponseModel } from '../models/response';
import { catchError, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = HttpClientHelper.baseURL.concat("/event")

  constructor(private http: HttpClient
    , private commonmasterService: CommonService) { }

  eventList(_obj: EventmasterModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.apiUrl.concat('/eventList'), _obj)
      .pipe(
        retry(1)
        , catchError(this.commonmasterService.handleError)
      );
  }

}
