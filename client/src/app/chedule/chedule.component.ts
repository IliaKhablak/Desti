import { Component, OnInit, EventEmitter} from '@angular/core';
import {trigger, animate, transition, style} from '@angular/animations';
import {AuthService} from '../services/auth.service';
import {MasterService} from '../services/master.service';
// import {MaterializeAction, MaterializeDirective} from "angular2-materialize";

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
  // birthDate:string;
  // birthTime:string;

  // birthDateActions = new EventEmitter<string|MaterializeAction>();
  // birthTimeActions = new EventEmitter<string|MaterializeAction>();
  date: Date = new Date();
    settings = {
        bigBanner: true,
        timePicker: false,
        format: 'dd-MM-yyyy',
        defaultOpen: true
    }
  username;
  masters;


  constructor(
    public auth:AuthService,
    private masterServise:MasterService
  ){
      this.auth.getProfile().subscribe(res=>{
        this.username = res['user'].username;
        this.masterServise.getAllMasters(this.username).subscribe(res=>{
          this.masters = res['masters'];
        })
      })
      // var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
      // document.write(utc);

      // this.birthDate = utc;
      // this.birthTime = "12:36";
  }

  onDateSelect(){
    console.log(this.date);
    // console.log('hi');
  }
  // bla(){
  //   console.log(this.birthDate);
  // }

  // openDatePicker() {
  //   //actions are open or close
  //   this.birthDateActions.emit({action: "pickadate", params: ["open"]});
  // }

  // setTime(time) {
  //     this.birthTime = time;
  // }

  // openTimePicker() {
  //     //actions are show or hide
  //     this.birthTimeActions.emit({action: "pickatime", params: ["show"]});
  // }
  
  ngOnInit(){
  }
}
