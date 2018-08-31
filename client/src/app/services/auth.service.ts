import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, BehaviorSubject} from "rxjs/Rx";
import {Router} from '@angular/router';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // domain = 'https://stormy-crag-43772.herokuapp.com';
  domain = 'http://localhost:8080';
  authToken;
  public user = new BehaviorSubject(null);
  options;
  headers;

  constructor(
    private http:HttpClient,
    private router:Router
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
    this.user.next(null);
    localStorage.clear();
    this.router.navigate(['/']);
  }

  storeUserData(token,expiresIn,user){
    const expiresAt = moment().add(expiresIn,'second');
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    this.authToken = token;
    this.user.next(user);
  }

  getProfile(){
    this.createAuthHeaders();
    return this.http.get(this.domain + '/authentication/profile',this.options);
  }

  loggedIn(){
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }    

  getUser(){
    if(localStorage['user']){
      this.user.next(JSON.parse(localStorage.getItem('user')));
    }else{
      this.user.next(null);
    }
  }
}
