import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsermasterModel } from '../models/usermaster';
import { UsermasterService } from '../services/usermaster.service';
import { finalize } from 'rxjs';
import { ResponseModel } from '../models/response';
import { AlertService, MessageSeverity } from '../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  isLoading: Boolean = false;
  usermasterModel = new UsermasterModel();

  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    private usermasterService: UsermasterService,
    private alertService: AlertService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      userName: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  get myFormControl() {
    return this.loginForm.controls;
  }

  onSubmit(objModel: UsermasterModel) {
    this.submitted = true;

    if (this.loginForm.valid) {
      console.log('Login successful', this.loginForm.value);
      this.isLoading = true;
      this.usermasterModel = objModel;
      //this.usermasterModel.userType = 0;

      this.usermasterService.login(this.usermasterModel)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe
        ((response: ResponseModel) => {
          this.isLoading = false;
          console.log('response', response)
          if (response.success == 1) {
            this.usermasterModel = response.data;
            console.log(this.usermasterModel)
            //alert('login successfully..!!!')

            //localStorage.setItem("_userId", this.usermasterModel.id.toString());
            localStorage.setItem("_name", this.usermasterModel.userName);

            localStorage.setItem("_token", this.usermasterModel.token);
            localStorage.setItem("_objUser", JSON.stringify(this.usermasterModel));
            localStorage.setItem("_session", "active");//set fix
            localStorage.setItem("_lastLogin", this.usermasterModel.lastlogintime);
            localStorage.setItem("_refreshToken", this.usermasterModel.refreshtoken);
            localStorage.setItem("_appVersion", this.usermasterModel.appversion);

            this.alertService.showMessage("", " 👋 ".concat('Admin').concat(' '), MessageSeverity.default);

            const jwtToken = JSON.parse(atob(this.accountService.getToken().split('.')[1]));
            // console.log("THIS IS TOKEN EXPIRATION ")
            const expires = new Date(jwtToken.exp * 1000);
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            console.log(timeout);
            //console.log(this.accountservice.getTokenModel());

            this.router.navigate(['dashboard']);

          } else {
            this.alertService.showMessage("", "Oops! Something went wrong! contact to administrator", MessageSeverity.error);
          }

        }, (err: HttpErrorResponse) => {
          console.log('error:')
          console.log(err)
          this.alertService.showMessage("Error", "Fail to get values!, Error: ".concat(err.message), MessageSeverity.error);
        })
    }
  }

}
