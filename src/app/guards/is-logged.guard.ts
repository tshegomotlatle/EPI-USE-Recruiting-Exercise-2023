import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {

  constructor(private userService: UserService, private router : Router){

  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loggedData = this.userService.getSessionData();
    console.log(loggedData.loggedIn);
    
    if (loggedData.loggedIn == "true")
    {
      // this.router.navigateByUrl("/hierarchy")
      return true;
    }
    else
    {
      this.router.navigateByUrl("/login")
      return false;
    }
  }
  
}
