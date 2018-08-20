import { Injectable }     from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    redirectUrl;
    
    constructor(
        private auth:AuthService,
        private router:Router
    ){}

  canActivate(
      ruret:ActivatedRouteSnapshot,
      state:RouterStateSnapshot
  ) {
    if(this.auth.loggedIn()){
        return true;
    }else{
        this.redirectUrl = state.url;
        this.router.navigate(['/login']);
        return false;
    }
  }
}