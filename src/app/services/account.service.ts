import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenModel } from '../models/token';
import { HttpClient } from '@angular/common/http';
import { HttpClientHelper } from '../Helper/http-client-helper';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = HttpClientHelper.baseURLaccount;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  getToken(): string {
    console.log('getToken')
    let result: any = '';
    if (localStorage.getItem('_token') != null) {
      result = localStorage.getItem('_token');
      result = result
      console.log('token found')
    } else {
      console.log('token not found: redirect to login from acc service')
      this.logout();
      //this.router.navigate(['login']);
      //redirect to login here
    }
    return result;
  }

  logout(): void {
    localStorage.removeItem("name");
    localStorage.removeItem("lastlogin");
    localStorage.removeItem("_token");
    localStorage.removeItem("_refreshtoken");
    localStorage.removeItem("objuser");
    localStorage.removeItem("session");
    localStorage.removeItem("appversion");
    localStorage.removeItem("currentCompanyObj");
    //localStorage.removeItem(this.commonmodel.companyOfUser);
  }

  getUserid(): string {
    return localStorage.getItem('userid') || '';
  }

  getTokenModel(): TokenModel | null {
    let userMasterModel = JSON.parse(localStorage.getItem('objuser') || '');
    if (userMasterModel) {
      let tokenModel = new TokenModel();
      tokenModel.token = this.getToken();
      tokenModel.refreshtoken = this.getRefreshToken();
      if ((tokenModel.token != null && tokenModel.token != "") && (tokenModel.refreshtoken != null && tokenModel.refreshtoken != "")) {
        return tokenModel;
      }
      return null;

    } else {
      return null;
    }
  }

  refreshToken(_obj: TokenModel) {
    return this.http.post<any>(this.apiUrl.concat('/getrefreshToken'), _obj)
      .pipe(map((token) => {
        return token;
      }));
  }

  getRefreshToken() {
    let result: any = '';
    if (localStorage.getItem('_refreshtoken') != null) {
      result = localStorage.getItem('_refreshtoken');
      //localStorage.getItem('_refreshtoken');
      // localStorage.setItem("_refreshtoken",this.cryptoService.decrypt(refreshtoken));
      console.log('token found')
    } else {
      console.log('token not found: redirect to login from acc service')
      this.logout();
      this.router.navigate(['login']);
      //redirect to login here
    }
    return result;
  }

  saveToken(token: any) {
    //localStorage.setItem("_token", token);
    localStorage.setItem("_token", token);
  }
  saveRefreshToken(refreshtoken: any) {
    //localStorage.setItem("_refreshtoken", refreshtoken);
    localStorage.setItem("_refreshtoken", refreshtoken);
  }

}
