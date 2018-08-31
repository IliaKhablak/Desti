import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {trigger, animate, transition, style} from '@angular/animations';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import { AuthGuard } from '../services/auth-guard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger(
     'enterAnimation', [
       transition('void => *', [
         style({opacity: 0}),
         animate('400ms', style({opacity: 1}))
       ]),
       transition('* => void', [
         style({opacity: 1}),
         animate('0ms', style({opacity: 0}))
       ])
     ]
    )]

})
export class LoginComponent implements OnInit {

  form;
  message:string;
  classMes:string;
  processing:boolean = false;
  showPassword:boolean = true;
  showPassword2:string = 'password';
  previousUrl;

  constructor(
    private formBuilder:FormBuilder,
    private auth:AuthService,
    private router:Router,
    private authGuard:AuthGuard
  ) {
    this.createForm();
  }

  createForm(){
    this.form = this.formBuilder.group({
      email:['', Validators.required],
      password:['', Validators.required]
    })
  }

  showPas(){
    this.showPassword = !this.showPassword;
    if(this.showPassword){this.showPassword2 = 'password'}
    else{this.showPassword2 = 'text'}
  }

  disableForm(){
    this.form.controls['email'].disable();
    this.form.controls['password'].disable();
  }

  enableForm(){
    this.form.controls['email'].enable();
    this.form.controls['password'].enable();
  }

  onLoginSubmit(){
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }
    this.auth.login(user).subscribe(res=>{
      if(!res['success']){
        console.log(res);
        this.message = res['message'];
        this.classMes = 'alert-danger';
        this.processing = false;
        this.enableForm();
      }else{
        this.message = res['message'];
        this.classMes = 'alert-success';
        this.auth.storeUserData(res['token'],res['expiresIn'],res['user']);
        setTimeout(()=>{
          if(this.previousUrl){
            this.router.navigate([this.previousUrl])
          }else{
            this.router.navigate(['/'])
          }
        },2000)
      }
    })
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.classMes = 'alert-danger';
      this.message = 'You mast be loged in';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

}
