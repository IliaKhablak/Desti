import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {MasterService} from '../services/master.service';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {trigger, animate, transition, style} from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
     )
  ]
})
export class DashboardComponent implements OnInit {

  message:string;
  classMes:string;
  newPost = false;
  loadingBlog = false;
  form: FormGroup;
  processing = false;
  userName;
  allBlogs;
  searchBloogs = [];
  category = [
    'nails',
    'eyelashes',
    'piatochki'
  ]


  constructor(
    private auth:AuthService,
    private masterService:MasterService,
    private formBuilder:FormBuilder
  ) {
    this.createNewMasterForm();
  }

  ngOnInit(){
    this.auth.getProfile().subscribe(res=>{
      // console.log(res['user'].u);

      this.masterService.getAllMasters(res['user'].username).subscribe(res=>{
        if(!res['success']){
          this.classMes = 'alert-danger';
          this.message = res['message'];
          setTimeout(()=>{
            this.message = null;
          },3000)
        }else{
          this.allBlogs = res['masters'];
        }
      })
    })
  }

  createNewMasterForm(){
    this.form = this.formBuilder.group({
      name:['',Validators.required],
      about:'',
      skills: []
    })
  }

  newMasterForm(){
    this.newPost = true;
  }

  onMasterSubmit(){
    console.log(this.form.controls['name'].value);
    console.log(this.form.controls['about'].value);
    console.log(this.form.controls['skills'].value);
  }

  goBack(){
    this.newPost = false;
    this.form.reset();
  }

  disableForm(){
    this.form.controls['title'].disable();
    this.form.controls['body'].disable();
  }

  enableForm(){
    this.form.controls['title'].enable();
    this.form.controls['body'].enable();
  }

}
