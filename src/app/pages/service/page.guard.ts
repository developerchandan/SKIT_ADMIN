import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageGuard  {


  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const userData = JSON.parse(localStorage.getItem('usersdata')!);
    if (userData && userData.userId) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}





