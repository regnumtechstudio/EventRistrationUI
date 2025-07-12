import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventmasterService } from '../services/eventmaster.service';
import { ClientmasterModel } from '../models/clientmaster';
import { finalize } from 'rxjs';
import { ResponseModel } from '../models/response';
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  totalEvents = 5;
  totalUsers = 123;
  clientmastermodel = new ClientmasterModel();
  totalGifted: number = 0;
  totalGiftPending: number = 0;

  constructor(
    private router: Router,
    private eventmasterService: EventmasterService,
  ) { }

  ngOnInit(): void {
    this.getTokenIssuedStatus();
    this.getTokenNotIssuedStatus();
  }

  events = [
    { name: 'Angular Meetup', date: '2025-06-10', count: 40 },
    { name: 'Hackathon', date: '2025-06-15', count: 60 },
    { name: 'AI Workshop', date: '2025-06-20', count: 25 },
  ];

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

    this.router.navigate(['login']);

  }

  getTokenIssuedStatus() {
    this.eventmasterService.getTokenIssuedStatus(this.clientmastermodel)
      .pipe(
        finalize(() => {
          //this.isLoading = false;
        })
      )
      .subscribe((response: ResponseModel) => {
        //this.isLoading = false;
        console.log('getTokenIssuedStatus', response)
        this.clientmastermodel = response.data;
        if (response.data) {
          this.totalGifted = response.data.totalcount;
          console.log('total gifted', this.totalGifted);
        }
      });
  }

  getTokenNotIssuedStatus() {
    this.eventmasterService.getTokenNotIssuedStatus(this.clientmastermodel)
      .pipe(
        finalize(() => {
          //this.isLoading = false;
        })
      )
      .subscribe((response: ResponseModel) => {
        //this.isLoading = false;
        console.log('getTokenIssuedStatus', response)
        this.clientmastermodel = response.data;
        if (response.data) {
          this.totalGiftPending = response.data.totalcount;
          console.log('total gift pending', this.totalGiftPending);
        }
      });
  }

}
