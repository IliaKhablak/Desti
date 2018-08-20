import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AntiAuthGuard implements CanActivate {

    constructor(
        private auth:AuthService,
        private router:Router
    ){}

  canActivate() {
    if(this.auth.loggedIn()){
        this.router.navigate(['/'])
        return false
    }else{
        return true
    }
  }
}