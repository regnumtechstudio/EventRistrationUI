import { Component, OnInit } from '@angular/core';
import { ClientmasterModel } from '../models/clientmaster';
import { ClientService } from '../services/client.service';
import { finalize } from 'rxjs';
import { ResponseModel } from '../models/response';
import { AlertService, MessageSeverity } from '../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventmasterModel } from '../models/eventmaster';
import { EventmasterService } from '../services/eventmaster.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-clientlist',
  standalone: false,
  templateUrl: './clientlist.component.html',
  styleUrl: './clientlist.component.css',
})
export class ClientlistComponent implements OnInit {

  isLoading: boolean = false;
  _datalist: ClientmasterModel[] = [];
  _datalistOfEvent: EventmasterModel[] = [];
  _dataSearchlist: ClientmasterModel[] = [];
  clientmastermodel = new ClientmasterModel();
  eventmasterModel = new EventmasterModel();
  isMobile: boolean = false;

  constructor(
    private clientService: ClientService,
    private alertService: AlertService,
    private eventmasterService: EventmasterService,
    private eventService: EventService,
  ) { }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    //this.getList();
    //this.demorecord()
    //this._datalist.push(this.clientmastermodel)
    this.eventList();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Bootstrap 'md' breakpoint
  }

  getList() {
    //this.isLoading = true;
    this.eventmasterService.getList(this.clientmastermodel)
      .pipe(
        finalize(() => {
          //this.isLoading = false;
        })
      )
      .subscribe((response: ResponseModel) => {
        this.isLoading = false;
        console.log('client list', response)
        this._datalist = this._dataSearchlist = response.data;
      });
  }

  giftIssued(clientId: number, eventId: number) {
    if (confirm('Are you sure ?')) {
      this.clientmastermodel.clientId = clientId;
      this.clientmastermodel.eventId = eventId;

      this.eventmasterService.tokenIssueStatusUpdate(this.clientmastermodel)
        .pipe(
          finalize(() => {
            //this.isLoading = false;
          })
        )
        .subscribe
        ((response: any) => {
          //this.isLoading = false;
          console.log('response', response)
          if (response.success == 1) {
            this.alertService.showMessage('', "Benefits issued!", MessageSeverity.success)
            this.getList();
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
    }

  }

  search(txtStr: string) {
    console.log('txtStr')
    console.log(txtStr.toLowerCase)
    txtStr = txtStr.toLowerCase();
    this._datalist = this._dataSearchlist.filter(x =>
      x.referenceNo?.toLowerCase().includes(txtStr) ||
      x.fullName?.toLowerCase().includes(txtStr) ||
      x.email?.toLowerCase().includes(txtStr) ||
      x.mobileNo?.toLowerCase().includes(txtStr) ||
      x.city?.toLowerCase().includes(txtStr)
    );
  }



  demorecord() {

    let client1 = new ClientmasterModel();
    client1.clientId = 1;
    client1.fullName = "Sapna Patel";
    client1.email = "sapnapatel2399@gmail.com";
    client1.mobileNo = "7041409312";
    client1.city = "Navsari";
    client1.tokenGiftIssued = true;

    let client2 = new ClientmasterModel();
    client2.clientId = 2;
    client2.fullName = "Rahul Sharma";
    client2.email = "rahul.sharma@example.com";
    client2.mobileNo = "9876543210";
    client2.city = "Mumbai";
    client2.tokenGiftIssued = false;

    let client3 = new ClientmasterModel();
    client3.clientId = 3;
    client3.fullName = "Anita Desai";
    client3.email = "anita.desai@example.com";
    client3.mobileNo = "9123456780";
    client3.city = "Ahmedabad";
    client3.tokenGiftIssued = false;

    this._datalist.push(client1, client2, client3);
  }

  eventList() {
    //this.isLoading = true;
    //this.eventmasterModel.id = 1;
    this.eventService.eventList(this.eventmasterModel)
      .pipe(
        finalize(() => {
          //this.isLoading = false;
        })
      )
      .subscribe((response: ResponseModel) => {
        this.isLoading = false;
        console.log('client list', response)
        this._datalistOfEvent = response.data;
      });
  }

  filter(id: number) {
    this.eventmasterModel.id = id;
    this.getList();
  }


}
