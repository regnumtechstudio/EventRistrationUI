import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thankyoupage',
  standalone: false,
  templateUrl: './thankyoupage.component.html',
  styleUrl: './thankyoupage.component.css'
})
export class ThankyoupageComponent implements OnInit {

  referenceNumber: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.referenceNumber = localStorage.getItem('referenceNumber') || 'N/A';

    // const nav = this.router.getCurrentNavigation(); // ✅ this.router is now defined

    // console.log('nav', nav);

    // const state = nav?.extras?.state as { referenceNumber?: string };

    // if (state?.referenceNumber) {
    //   this.referenceNumber = state.referenceNumber;
    //   console.log('ref2', this.referenceNumber);
    // } else {
    //   this.referenceNumber = 'N/A';
    //   console.log('ref3', this.referenceNumber);
    // }
  }


}
