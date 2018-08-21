import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public auth:AuthService,
    private router:Router,
    private flash:FlashMessagesService
  ) { }

  ngOnInit() {
  }

  logout(){
    this.auth.logOut();
    this.flash.show('You are logged uot',{cssClass: 'alert-success', timeout: 2000});
    this.router.navigate(['/']); 
  }

}
