import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs/Rx";
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  domain = this.auth.domain;
  user;
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

  newBlog(blog){
    this.createAuthHeaders();
    // console.log(blog);
    return this.http.post(this.domain+'/blogs/newBlog', blog, {headers:this.headers})
  }

  getAllBlogs(){
    return this.http.get(this.domain+'/authentication/allBlogs');
  }

  deleteBlog(id){
    this.createAuthHeaders();
    return this.http.delete(this.domain+'/blogs/deleteBlog/'+id,{headers:this.headers})
  }

  findBlog(title){
    return this.http.get(this.domain + '/authentication/findBlog/' + title)
  }
}
