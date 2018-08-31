import { Component, OnInit,EventEmitter } from '@angular/core';
import {MasterService} from '../services/master.service';
import {ScheduleService} from '../services/schedule.service';
import {trigger, animate, transition, style} from '@angular/animations';
import {AuthService} from '../services/auth.service';
import {MaterializeAction} from 'angular2-materialize';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-booking-business',
  templateUrl: './booking-business.component.html',
  styleUrls: ['./booking-business.component.css'],
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
   ),
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
export class BookingBusinessComponent implements OnInit {

  modalActions = new EventEmitter<string|MaterializeAction>();
  pressed = false;
  sendDate;
  date: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: false,
    format: 'dd-MM-yyyy',
    defaultOpen: true
  };
  message:string;
  classMes:string;
  response;
  user;
  reason = '';
  reasonCheck = false;
  unBookNumber;

  constructor(
    private masterService:MasterService,
    private schedule:ScheduleService,
    private auth:AuthService,
    private chat:ChatService
  ){
    this.sendDate = this.date.toISOString().slice(0,10);
    this.chat.message.subscribe(msg=>{
      if (msg['type'] === 'day'){  
        if(msg['action'] === 'remove'){
          this.response = this.response.filter(item => item._id.indexOf(msg['dayId']) < 0);
        }else{
          let i = this.response.findIndex(el=>el._id === msg['dayId']);
          console.log(i);
          this.response[i].booked = msg['day'].booked;
          this.response[i]._bookedBy = msg['day']._bookedBy;
        }       
      }else{}
    })
  }

  onDateSelect(event){
    this.sendDate = event.toISOString().slice(0,10);
    this.ngOnInit();
  }

  ngOnInit(){
    if(this.auth.user.value === null){
      this.auth.getUser();
      this.auth.user.subscribe(res=>this.user = res)
    }else{
      this.auth.user.subscribe(res=>this.user = res)
    }
    this.schedule.getAllBookings(this.sendDate).subscribe(res=>{
      this.response = res['res'];
      // console.log(res);
    })
  }

  onBook(one){
    one.booked = true;
    one._bookedBy = this.user.userId
    // console.log(one);
    this.schedule.updateDay(one).subscribe(res=>{
      // console.log(res);
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

  unBook(one,i){
    if(one._bookedBy !== this.user.userId){
      this.unBookNumber = i;
     this.openModal();
    }else{
      one.booked = false;
      one._bookedBy = null;
      this.schedule.updateDay(one).subscribe(res=>{
        // console.log(res);
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
  }

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }

  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  onSearchChange(event){
    this.reason = event.target.value;
    let re = /^[a-zA-Z0-9]+$/;
    if(re.test(this.reason)){
      this.reasonCheck = false;
    }else{
      this.reasonCheck = true;
    }
  }

  onReasonSubmit(){
    this.response[this.unBookNumber].booked = false;
    this.response[this.unBookNumber]._bookedBy = null;
    this.response[this.unBookNumber].reason = this.reason;
    this.schedule.updateDay(this.response[this.unBookNumber]).subscribe(res=>{
      // console.log(res);
      if(res['success']){
        this.message = res['message'];
        this.classMes = 'alert-success';
        setTimeout(()=>{
          this.message = null;
        },2000)
      }else{
        this.message = res['message'];
        this.classMes = 'alert-danger';
        this.response[this.unBookNumber].booked = true;
      }
    })
  }
}
