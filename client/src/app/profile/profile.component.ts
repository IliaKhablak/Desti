import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';  

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user;

  constructor(
    private auth:AuthService
  ) { }

  ngOnInit() {
    if(this.auth.user.value === null){
      this.auth.getUser();
      this.auth.user.subscribe(res=>this.user = res)
    }else{
      this.auth.user.subscribe(res=>this.user = res)
    }
  }

}
