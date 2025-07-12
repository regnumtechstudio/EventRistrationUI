import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  private platformId = inject(PLATFORM_ID);

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('_token');
      return !!token;
    } else {
      // On server, assume unauthenticated
      return false;
    }
  }

  // canActivate(): boolean | UrlTree {
  //   const isLoggedIn = !!localStorage.getItem('_token'); // Or however you manage auth

  //   if (isLoggedIn) {
  //     return true;
  //   } else {
  //     return this.router.parseUrl('login');
  //   }
  // }
}
