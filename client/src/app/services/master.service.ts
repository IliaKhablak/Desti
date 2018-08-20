import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs/Rx";
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  domain = this.auth.domain;
  headers: HttpHeaders;

  constructor(
    private http:HttpClient,
    private auth:AuthService
  ) { }

  createAuthHeaders(){
    this.auth.loadToken();
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('authorization', this.auth.authToken);
  }

  newMaster(master){
    this.createAuthHeaders();
    // console.log(blog);
    return this.http.post(this.domain+'/masters/newMaster', master, {headers:this.headers})
  }

  getAllMasters(username){
    this.createAuthHeaders();
    return this.http.get(this.domain+'/masters/allMasters/'+username, {headers:this.headers});
  }

  deleteMaster(id){
    this.createAuthHeaders();
    return this.http.delete(this.domain+'/masters/deleteMaster/'+id,{headers:this.headers})
  }

  // findBlog(title){
  //   return this.http.get(this.domain + '/authentication/findBlog/' + title)
  // }
}
