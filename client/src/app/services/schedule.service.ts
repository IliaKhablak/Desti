import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs/Rx";
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

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

  getDay(day,masterId){
    this.createAuthHeaders();
    return this.http.get(this.domain+'/schedule/day/'+day+'_'+masterId,{headers:this.headers});
  }

  setWorkingDay(unit){
    // console.log(unit);
    this.createAuthHeaders();
    return this.http.post(this.domain+'/schedule/newDay',unit,{headers:this.headers});
  }

  removeWorkindDay(day){
    this.createAuthHeaders();
    return this.http.delete(this.domain+'/schedule/removeDay/'+day,{headers:this.headers})
  }

  searchForBooking(request){
    this.createAuthHeaders();
    return this.http.post(this.domain + '/schedule/search',request,{headers:this.headers})
  }

  updateDay(day){
    this.createAuthHeaders();
    return this.http.post(this.domain + '/schedule/update',day,{headers:this.headers})
  }

  getAllBookings(date){
    this.createAuthHeaders();
    return this.http.get(this.domain+'/schedule/allBookings/'+date,{headers:this.headers})
  }
}
