import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs';
import { ClientmasterModel } from '../models/clientmaster';
import { ClientService } from '../services/client.service';
import { OtpManagerModel } from '../models/otpmanager';
import { ResponseModel } from '../models/response';
import { AlertService, MessageSeverity } from '../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserRefrence } from '../models/usermaster';

@Component({
  selector: 'app-eventregistrationmaster',
  standalone: false,
  templateUrl: './eventregistrationmaster.component.html',
  styleUrl: './eventregistrationmaster.component.css'
})
export class EventregistrationmasterComponent implements OnInit {

  //isLoading: boolean = false;
  registrationForm!: FormGroup;
  otpSentMobile = false;
  otpSentEmail = false;
  otpMobile!: string;
  otpEmail!: string;
  submitted = false;
  timerMobile = 0;
  timerEmail = 0;
  mobileInterval: any;
  emailInterval: any;
  clientMasterModal = new ClientmasterModel();
  otpManagerModel = new OtpManagerModel();
  emailOtpVerified: boolean | null = null;
  mobileOtpVerified: boolean | null = null;
  submittedMobile = false
  submittedEmail = false

  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    private clientService: ClientService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {

    this.registrationForm = this.formbuilder.group({
      eventId: [1],
      fullName: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10 digits for mobile
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      otpMobile: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      otpEmail: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });

    // this.registrationForm.get('mobile')?.valueChanges.pipe(debounceTime(300)).subscribe(val => {
    //   if (val && this.otpSentMobile) {
    //     this.registrationForm.get('otpMobile')?.enable();
    //   } else {
    //     this.registrationForm.get('otpMobile')?.disable();
    //   }
    // });

    // this.registrationForm.get('email')?.valueChanges.pipe(debounceTime(300)).subscribe(val => {
    //   if (val && this.otpSentEmail) {
    //     this.registrationForm.get('otpEmail')?.enable();
    //   } else {
    //     this.registrationForm.get('otpEmail')?.disable();
    //   }
    // });

  }

  get myFormControl() {
    return this.registrationForm.controls;
  }

  // sendOTP(type: string): void {
  //   if (type === 'mobile') {
  //     this.otpSentMobile = true;
  //     this.otpMobile = '123456';  // Mock OTP
  //     console.log('OTP for mobile sent');
  //   } else if (type === 'email') {
  //     this.otpSentEmail = true;
  //     this.otpEmail = '654321';  // Mock OTP
  //     console.log('OTP for email sent');
  //   }
  // }
  sendOTP(type: string) {
    if (type === 'mobile') {
      this.submittedMobile = true;
      if (this.myFormControl['mobileNo'].valid) {

        this.otpSentMobile = true;
        this.timerMobile = 60; // 60 seconds
        clearInterval(this.mobileInterval);
        this.registrationForm.get('otpMobile')?.enable();

        this.mobileInterval = setInterval(() => {
          this.timerMobile--;
          if (this.timerMobile === 0) {
            clearInterval(this.mobileInterval);
          }
        }, 1000);
      }

    } else if (type === 'email') {
      this.submittedEmail = true;
      if (this.myFormControl['email'].valid) {
        this.otpSentEmail = true;
        this.timerEmail = 60; // 60 seconds
        clearInterval(this.emailInterval);
        this.registrationForm.get('otpEmail')?.enable();

        this.emailInterval = setInterval(() => {
          this.timerEmail--;
          if (this.timerEmail === 0) {
            clearInterval(this.emailInterval);
          }
        }, 1000);
      }
    }

  }

  startTimer(type: 'mobile' | 'email') {
    const duration = 60;
    if (type === 'mobile') {
      clearInterval(this.mobileInterval);
      this.timerMobile = duration;
      this.mobileInterval = setInterval(() => {
        this.timerMobile--;
        if (this.timerMobile <= 0) {
          clearInterval(this.mobileInterval);
        }
      }, 1000);
    } else {
      clearInterval(this.emailInterval);
      this.timerEmail = duration;
      this.emailInterval = setInterval(() => {
        this.timerEmail--;
        if (this.timerEmail <= 0) {
          clearInterval(this.emailInterval);
        }
      }, 1000);
    }
  }

  onSubmit() {
    this.submitted = true
    if (this.registrationForm.valid) {
      if (this.mobileOtpVerified == true) {
        if (this.emailOtpVerified == true) {
          let clientmasterModel = new ClientmasterModel()
          clientmasterModel = Object.assign({}, this.registrationForm.getRawValue()) //value
          console.log('data', clientmasterModel)
          this.clientService.add(clientmasterModel)
            .pipe(
              finalize(() => {
                //this.isLoading = false;
              })
            )
            .subscribe
            ((response: ResponseModel) => {
              //this.isLoading = false;
              console.log('response', response)
              if (response.success == 1) {
                this.alertService.showMessage('', "Successfully submitted!", MessageSeverity.success)
               
                let clientmasterModel = new ClientmasterModel()
                if (response.data) {
                  clientmasterModel = response.data;
                  localStorage.setItem('referenceNumber', clientmasterModel.referenceNo);
                  this.router.navigate(['thankyou'], {
                    state: { referenceNumber: clientmasterModel.referenceNo }
                  });
                }
                // localStorage.setItem('referenceNumber', response.data);
                // console.warn('referenceNumber', response.data)
                // if (response.data) {
                //   this.router.navigate(['thankyou'], {
                //     state: { referenceNumber: response.data }

                //   });
                //   //console.log('ref no:',referenceNumber)
                // }
              }
              else if (response.success == 2) {
                this.alertService.showMessage('', "Already exists!", MessageSeverity.warn)
              }
              else {
                this.alertService.showMessage('', "Oops! Something went wrong! contact to administrator", MessageSeverity.error)
              }
            }, (err: HttpErrorResponse) => {
              //this.isLoading=false
              console.log('save error:')
              console.log(err);
              this.alertService.showMessage("Error", "Fail to save!, Error: ".concat(err.message), MessageSeverity.error);
            });
        } else {
          this.alertService.showMessage('', 'Please enter valid email OTP', MessageSeverity.error)
        }
      } else {
        this.alertService.showMessage('', 'Please enter valid mobile OTP', MessageSeverity.error)
      }

    }
  }

  generateEmailOTP() {
    //this.isLoading = true;
    if (this.myFormControl['email'].valid) {

      this.otpManagerModel.email = this.myFormControl['email'].value
      this.clientService.generateEmailOTP(this.otpManagerModel)
        .pipe(
          finalize(() => {
            //this.isLoading = false;
          })
        ).subscribe
        ((response: ResponseModel) => {

          console.log('response', response)
          if (response.success == 1) {
            this.alertService.showMessage('', "OTP code has been sent to your email!", MessageSeverity.success)
          }
          else {
            this.alertService.showMessage("", "Oops! Something went wrong! contact to administrator", MessageSeverity.error);
          }
        }, (err: HttpErrorResponse) => {
          //this.isLoading = false;
          console.log('save error:')
          console.log(err)
          this.alertService.showMessage("Error", "Fail to get values!, Error: ".concat(err.message), MessageSeverity.error);
        });
    }

  }

  verifyEmailOTP() {
    if (this.myFormControl['otpEmail'].valid) {
      //this.isLoading = true
      this.otpManagerModel.email = this.myFormControl['email'].value
      this.otpManagerModel.otpCode = this.myFormControl['otpEmail'].value
      this.clientService.verifyEmailOTP(this.otpManagerModel)
        .pipe(
          finalize(() => {
            //this.isLoading = false;
          })
        ).subscribe
        ((response: ResponseModel) => {
          console.log('verifyOTP,response', response)
          if (response.success == 1) {
            this.myFormControl['email'].disable();
            this.emailOtpVerified = true;
            this.myFormControl['otpEmail'].disable();
            //this.alertService.showMessage('', "Verified email!", MessageSeverity.success)
            return;
          } else if (response.success == 2) {
            this.alertService.showMessage('', "OTP is expired!", MessageSeverity.error)
          } else if (response.success == 0) {
            this.emailOtpVerified = false;
            //this.alertService.showMessage('', "Invalid OTP!", MessageSeverity.error)
          }
          // else {
          //   this.alertService.showMessage("", "Oops! Something went wrong! contact to administrator", MessageSeverity.error);
          // }
        }, (err: HttpErrorResponse) => {
          //this.isLoading = false;
          console.log('save error:')
          console.log(err)
          this.alertService.showMessage("Error", "Fail to get values!, Error: ".concat(err.message), MessageSeverity.error);
        });
    }
  }

  generateMobileOTP() {
    //this.isLoading = true;
    if (this.myFormControl['mobileNo'].valid) {

      this.otpManagerModel.mobile = this.myFormControl['mobileNo'].value
      this.clientService.generateMobileOTP(this.otpManagerModel)
        .pipe(
          finalize(() => {
            //this.isLoading = false;
          })
        ).subscribe
        ((response: ResponseModel) => {

          console.log('response', response)
          if (response.success == 1) {
            this.alertService.showMessage('', "OTP code has been sent to your mobile!", MessageSeverity.success)
          }
          else {
            this.alertService.showMessage("", "Oops! Something went wrong! contact to administrator", MessageSeverity.error);
          }
        }, (err: HttpErrorResponse) => {
          //this.isLoading = false;
          console.log('save error:')
          console.log(err)
          this.alertService.showMessage("Error", "Fail to get values!, Error: ".concat(err.message), MessageSeverity.error);
        });
    }

  }

  verifyMobileOTP() {
    if (this.myFormControl['otpMobile'].valid) {
      //this.isLoading = true
      this.otpManagerModel.mobile = this.myFormControl['mobileNo'].value
      this.otpManagerModel.otpCode = this.myFormControl['otpMobile'].value
      this.clientService.verifyMobileOTP(this.otpManagerModel)
        .pipe(
          finalize(() => {
            //this.isLoading = false;
          })
        ).subscribe
        ((response: ResponseModel) => {
          console.log('verifyOTP,response', response)
          if (response.success == 1) {
            this.myFormControl['mobileNo'].disable();
            this.mobileOtpVerified = true;
            this.myFormControl['otpMobile'].disable();
            //this.alertService.showMessage('', "Verified email!", MessageSeverity.success)
            return;
          } else if (response.success == 2) {
            this.alertService.showMessage('', "OTP is expired!", MessageSeverity.error)
          } else if (response.success == 0) {
            this.mobileOtpVerified = false;
            //this.alertService.showMessage('', "Invalid OTP!", MessageSeverity.error)
          }
          // else {
          //   this.alertService.showMessage("", "Oops! Something went wrong! contact to administrator", MessageSeverity.error);
          // }
        }, (err: HttpErrorResponse) => {
          //this.isLoading = false;
          console.log('save error:')
          console.log(err)
          this.alertService.showMessage("Error", "Fail to get values!, Error: ".concat(err.message), MessageSeverity.error);
        });
    }
  }

}



