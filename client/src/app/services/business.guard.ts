import { Injectable }     from '@angular/core';
import { CanActivate, Router}    from '@angular/router';

@Injectable()
export class BusinessGuard implements CanActivate {

    redirectUrl;
    
    constructor(
        private router:Router
    ){}

  canActivate() {
    if(JSON.parse(localStorage.getItem("user")).business){
        return true;
    }else{
        this.router.navigate(['/']);
        return false;
    }
  }
}