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
    this.auth.getProfile().subscribe(res=>{
      this.user = res['user']
    })
  }

}
