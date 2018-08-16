import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs/Rx";
import {tokenNotExpired} from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  domain = 'http://localhost:8080';
  authToken;
  user;
  options;
  headers;

  constructor(
    private http:HttpClient
  ) {
  }

  createAuthHeaders(){
    this.loadToken();
    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'authorization': this.authToken
      })
    }
  }

  loadToken(){
    this.authToken = localStorage.getItem('token');
  }

  registerUser(user){
    return this.http.post(this.domain + '/authentication/register',user)
  }

  checkUserName(username){
    return this.http.get(this.domain + '/authentication/checkUsername/' + username)
  }

  checkEmail(email){
    return this.http.get(this.domain + '/authentication/checkEmail/' + email)
  }

  login(user){
    return this.http.post(this.domain+'/authentication/login',user)
  }

  logOut(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token,user){
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile(){
    this.createAuthHeaders();
    return this.http.get(this.domain + '/authentication/profile',this.options);
  }

  loggedIn(){
    return tokenNotExpired();
  }
}
