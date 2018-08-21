import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {trigger, animate, transition, style} from '@angular/animations';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
export class RegisterComponent implements OnInit {

  form;
  message:string;
  classMes:string;
  processing:boolean = false;
  showPassword:boolean = true;
  showPassword2:string = 'password';
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
    private formBuilder:FormBuilder,
    private auth:AuthService,
    private router:Router
  ) {
    this.createForm();
  }

  validateEmail(controls){
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(controls.value)){
      return null
    }else{
      return {'validateEmail':true}
    }
  }

  validateUserName(controls){
    let re = /^[a-zA-Z0-9]+$/;
    if(re.test(controls.value)){
      return null
    }else{
      return {'validateUserName':true}
    }
  }

  validatePassword(controls){
    let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if(re.test(controls.value)){
      return null
    }else{
      return {'validatePassword':true}
    }
  }

  matchingPassword(password,confirm){
    return (group:FormGroup)=>{
      if(group.controls.password.value === group.controls.confirm.value){
        return null;
      }else{
        return {'matchingPassword': true}
      }
    }
  }

  createForm(){
    this.form = this.formBuilder.group({
      email:['', Validators.compose([
        Validators.required,
        this.validateEmail
      ])],
      username:['',  Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUserName
      ])],
      password:['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        this.validatePassword
      ])],
      confirm:''
    },{validator:this.matchingPassword('password','confirm')})
  }

  showPas(){
    this.showPassword = !this.showPassword;
    if(this.showPassword){this.showPassword2 = 'password'}
    else{this.showPassword2 = 'text'}
  }

  disableForm(){
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  enableForm(){
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  onRegisterSubmit(){
    this.processing = true;
    this.disableForm();
    this.emailMessage = null;
    this.usernameMessage = null;
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.auth.registerUser(user).subscribe(res=>{
      // console.log(res['success']);
      // console.log(res['message']);
      if(res['success']){
        this.message = res['message'];
        this.classMes = 'alert-success';
        this.auth.storeUserData(res['token'],res['expiresIn'] ,res['user']);
        setTimeout(()=>{
          this.router.navigate(['/'])
        },2000)
      }else{
        this.message = res['message'];
        this.classMes = 'alert-danger';
        this.processing = false;
        this.enableForm();
      }
    });
  }

  checkEmail(){
    this.auth.checkEmail(this.form.get('email').value).subscribe(res=>{
      if(!res['success']){
        this.emailValid = false;
        this.emailMessage = res['message'];
      }else{
        this.emailValid = true;
        this.emailMessage = res['message'];
      }
    })
  }

  checkUsername(){
    this.auth.checkUserName(this.form.get('username').value).subscribe(res=>{
      if(!res['success']){
        this.usernameValid = false;
        this.usernameMessage = res['message'];
      }else{
        this.usernameValid = true;
        this.usernameMessage = res['message'];
      }
    })
  }

  ngOnInit() {
  }

}
