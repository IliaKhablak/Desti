import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {trigger, animate, transition, style} from '@angular/animations';


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

  form: FormGroup;

  constructor(
    private formBuilder:FormBuilder
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

  onRegisterSubmit(){
    console.log(this.form);
  }

  ngOnInit() {
  }

}
