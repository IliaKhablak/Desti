import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {trigger, animate, transition, style} from '@angular/animations';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';


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

  form: FormGroup;
  message:string;
  classMes:string;
  processing:boolean = false;
  showPassword:boolean = true;
  showPassword2:string = 'password';

  constructor(
    private formBuilder:FormBuilder,
    private auth:AuthService,
    private router:Router
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
        this.message = res['message'];
        this.classMes = 'alert-danger';
        this.processing = false;
        this.enableForm();
      }else{
        this.message = res['message'];
        this.classMes = 'alert-success';
        this.auth.storeUserData(res['token'],res['user']);
        setTimeout(()=>{
          this.router.navigate(['/'])
        },2000)
      }
    })
  }

  ngOnInit() {
  }

}
