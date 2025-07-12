import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  isSidebarOpen: boolean = false;

   toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth <= 767) {
      this.isSidebarOpen = false;
    }
  }

   onMenuItemClick() {
    this.closeSidebarOnMobile(); // ✅ Close sidebar on mobile after menu click
  }

}
