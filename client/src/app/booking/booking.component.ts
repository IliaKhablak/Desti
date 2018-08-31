import { Component, OnInit } from '@angular/core';
import {MasterService} from '../services/master.service';
import {ScheduleService} from '../services/schedule.service';
import {trigger, animate, transition, style} from '@angular/animations';
import {AuthService} from '../services/auth.service';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  animations: [trigger(
    'enterAnimation2', [
      transition('void => *', [
        style({opacity: 0}),
        animate('400ms', style({opacity: 1}))
      ]),
      transition('* => void', [
        style({opacity: 1}),
        animate('400ms', style({opacity: 0}))
      ])
    ]
   )]
})
export class BookingComponent implements OnInit {

  category;
  pressed = false;
  controls; 
  controls2;
  sendDate;
  date: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: false,
    format: 'dd-MM-yyyy',
    defaultOpen: true
  };
  helperArray = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
  message:string;
  classMes:string;
  response;
  user;

  constructor(
    private masterService:MasterService,
    private schedule:ScheduleService,
    private auth:AuthService,
    private chat:ChatService
  ){
    this.masterService.getAllCategories().subscribe(res=>{
      this.category = res['categories'].category;
      // this.controls = this.category.map(c=> new FormControl(false));
      this.sendDate = this.date.toISOString().slice(0,10);
      this.controls = this.category.map(c=> false);
    });
    this.controls2 = this.helperArray.map(c=> false);
    this.chat.message.subscribe(msg=>{
      if (msg['type'] === 'day'){  
        if(msg['action'] === 'remove'){
          this.response = this.response.filter(item => item._id.indexOf(msg['dayId']) < 0);
        }else{}       
      }else{}
    })
  }

  validateUserName(controls){
    if( controls.value.includes(true)){
      return null
    }else{
      return {
        'validateUserName':true}
    }
  }

  onDateSelect(event){
    this.sendDate = event.toISOString().slice(0,10);
  }

  onMasterSubmit(){
    this.pressed = true;
    if(!this.controls.includes(true) || !this.controls2.includes(true)){}else{
      const selectedOrderIds = this.controls
        .map((v, i) => v ? this.category[i] : null)
        .filter(v => v !== null);
      const selectedOrderIds2 = this.controls2
        .map((v, i) => v ? this.helperArray[i] : null)
        .filter(v => v !== null);
      let a = {
        categories: selectedOrderIds,
        date: this.sendDate,
        hours: selectedOrderIds2
      }
      this.schedule.searchForBooking(a).subscribe(res=>{
        this.response = res['res'];
        // console.log(res);
      })
    }
  }

  onBook(one){
    one.booked = true;
    one._bookedBy = this.user.userId
    console.log(one);
    this.schedule.updateDay(one).subscribe(res=>{
      console.log(res);
      if(res['success']){
        this.message = res['message'];
        this.classMes = 'alert-success';
        setTimeout(()=>{
          this.message = null;
        },2000)
      }else{
        this.message = res['message'];
        this.classMes = 'alert-danger';
        one.booked = false;
      }
    })
  }

  unBook(one){
    one.booked = false;
    one._bookedBy = null;
    this.schedule.updateDay(one).subscribe(res=>{
      console.log(res);
      if(res['success']){
        this.message = res['message'];
        this.classMes = 'alert-success';
        setTimeout(()=>{
          this.message = null;
        },2000)
      }else{
        this.message = res['message'];
        this.classMes = 'alert-danger';
        one.booked = true;
      }
    })
  }

  ngOnInit(){
    if(this.auth.user.value === null){
      this.auth.getUser();
      this.auth.user.subscribe(res=>this.user = res)
    }else{
      this.auth.user.subscribe(res=>this.user = res)
    }
    console.log(this.user)
  }

}
