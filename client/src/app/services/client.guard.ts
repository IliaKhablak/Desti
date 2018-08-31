import { Injectable }     from '@angular/core';
import { CanActivate, Router}    from '@angular/router';

@Injectable()
export class ClientGuard implements CanActivate {

    redirectUrl;
    
    constructor(
        private router:Router
    ){}

  canActivate() {
    if(JSON.parse(localStorage.getItem("user")).business){
        this.router.navigate(['/']);
        return false;
    }else{
        return true;
    }
  }
}