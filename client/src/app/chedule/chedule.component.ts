import { Component, OnInit, EventEmitter} from '@angular/core';
import {trigger, animate, transition, style} from '@angular/animations';
import {MaterializeAction, MaterializeDirective} from "angular2-materialize";
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import * as $ from 'jquery';

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
  birthDate:string;
  birthTime:string;

  birthDateActions = new EventEmitter<string|MaterializeAction>();
  birthTimeActions = new EventEmitter<string|MaterializeAction>();
  form: FormGroup;



  constructor(private fb: FormBuilder) {
      this.birthDate = "03/12/2017";
      this.birthTime = "12:36";
      this.form = this.fb.group({
          'fromDate': new FormControl('06/07/2017'),
          'fromTime': new FormControl('08:30')
      });
  }

  openDatePicker() {
      //actions are open or close
      this.birthDateActions.emit({action: "pickadate", params: ["open"]});
      $('.picker__date-display').append("<h3>Hi there!</h3>");
  }

  setTime(time) {
      this.birthTime = time;
  }

  openTimePicker() {
      //actions are show or hide
      this.birthTimeActions.emit({action: "pickatime", params: ["show"]});
  }

  bla(){
    console.log('date');
  }

  ngOnInit(){
    $( "#datepicker" ).datepicker();
  }
}
