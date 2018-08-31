import { Component, OnInit} from '@angular/core';
import {trigger, animate, transition, style} from '@angular/animations';
import {AuthService} from '../services/auth.service';
import {MasterService} from '../services/master.service';
import {ScheduleService} from '../services/schedule.service';
import * as $ from 'jquery';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-chedule',
  templateUrl: './chedule.component.html',
  styleUrls: ['./chedule.component.css'],
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
    ),
    trigger(
      'popupAnim', [
        transition('void => *', [
          style({transform: 'translateY(100%)',opacity: 0}),
          animate('400ms', style({transform: 'translateY(0)',opacity: 1}))
        ]),
        transition('* => void', [
          style({transform: 'translateY(0)',opacity: 1}),
          animate('400ms', style({transform: 'translateY(-100%)',opacity: 0}))
        ])
      ]
     )
    ]
})
export class CheduleComponent implements OnInit {

  message:string;
  classMes:string;
  date: Date = new Date();
  sendDate;
    settings = {
        bigBanner: true,
        timePicker: false,
        format: 'dd-MM-yyyy',
        // defaultOpen: true
    }
    masters = [];
    helperArray = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
    user;

  constructor(
    public auth:AuthService,
    private masterServise:MasterService,
    private schedule:ScheduleService,
    private chat:ChatService
  ){
    this.sendDate = this.date.toISOString().slice(0,10);
    if(this.auth.user.value === null){
      this.auth.getUser();
      this.auth.user.subscribe(res=>this.user = res)
    }else{
      this.auth.user.subscribe(res=>this.user = res)
    }
    this.chat.message.subscribe(msg=>{
      if (msg['type'] === 'day'){  
        if(msg['action'] === 'remove'){
          let i = this.masters.findIndex(el=>Object.values(el.ids).includes(msg['dayId']));
          let indexOfId = Object.values(this.masters[i].ids).findIndex(msg['dayId']);
          let hour = Object.keys(this.masters[i].ids)[indexOfId];
          this.masters[i].ids[hour] = null;
          this.masters[i].types[hour] = false;
        }else{
          if(msg['day'].booked){
            let str = '#'+msg['day']._masterId+''+msg['day'].hour;
            $(str).attr("disabled",true);
          }else{
            let str = '#'+msg['day']._masterId+''+msg['day'].hour;
            $(str).attr("disabled",false);
          }
        }       
      }else{}
    })
  }

  onDateSelect(event){
    this.sendDate = event.toISOString().slice(0,10);
    this.ngOnInit()
    // console.log( this.sendDate);
  }

  // @HostListener('mouseover',['$event'])
  // onMouseOver() {
  //   let part = this.el.nativeElement.querySelector('.disabledMessage');
  //   console.log(event.target);
  //   console.log(part);
  //   if(part === event.target){
      
  //     this.classMes = 'alert-danger';
  //     this.message = 'You should cancel booking first';
  //   }
  //   // this.renderer.setElementStyle(part, 'color', 'red');
  //   // console.log(event);
  // }

  // @HostListener('mouseout',['$event'])
  // onMouseOut() {
  //   let part = this.el.nativeElement.querySelector('.disabledMessage');
  //   if(part === event.target){
  //     this.message = null;
  //   }
  //   // this.renderer.setElementStyle(part, 'color', 'black');
  // }

  
  ngOnInit(){
    this.masterServise.getAllMasters().subscribe(res=>{
      let i = 0;
      res['masters'].forEach(element => {
        this.schedule.getDay(this.sendDate,element._id).subscribe(day=>{
          this.masters[i] = {
            master: element,
            types:{
              8:false,
              9:false,
              10:false,
              11:false,
              12:false,
              13:false,
              14:false,
              15:false,
              16:false,
              17:false,
              18:false,
              19:false,
              20:false,
              21:false,
              22:false
            },
            ids:{}
          };
          if(day['day']){
            day['day'].forEach(el=>{
              this.masters[i].types[el.hour]=true;
              this.masters[i].ids[el.hour] = el._id;
              if(el.booked){
                let str = '#'+this.masters[i].master._id+''+el.hour;
                setTimeout(()=>{
                  $(str).attr("disabled",true);
                },200)
              }
            })
          };
          i++;
        });
      });
    });
  }

  makeABooking(master,hour,bool:HTMLInputElement,unitId,idx){
    if(bool.checked){
      let a = {
        _userId:this.user.userId,
        _masterId:master._id,
        categories:master.skills,
        date:this.sendDate,
        hour:hour
      }
      this.schedule.setWorkingDay(a).subscribe(res=>{
        this.message = res['message'];
        if(res['success']){
          this.classMes = 'alert-success';
          this.masters[idx].types[hour]=true;
          this.masters[idx].ids[hour] = res['unit']._id;
        }else{
          this.masters[idx].types[hour]=false;
          this.classMes = 'alert-danger';
        }
        setTimeout(()=>{
          this.message = null;
        },1000)
      });
    }else{
      // console.log(unitId);
      
      this.schedule.removeWorkindDay(unitId)
        .subscribe(res=>{
          if(res['success']){
            this.message = res['message'];
            this.classMes = 'alert-success';
            setTimeout(()=>{
              this.message  = null;
            },1000);
          }else{

            this.masters[idx].types[hour]=true;
            this.message = res['message'];
            this.classMes = 'alert-danger';
            setTimeout(()=>{
              this.message  = null;
            },1000);
          }
        })
    }
  }
}
