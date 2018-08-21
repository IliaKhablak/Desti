import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {MasterService} from '../services/master.service';
import {FormControl, FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
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
  controls;
  category = [
    'nails',
    'eyelashes',
    'piatochki'
  ];
  username;
  editTodos = [];
  formEdit;
  editControls;
  editProcess = false;



  constructor(
    private auth:AuthService,
    private masterService:MasterService,
    private formBuilder:FormBuilder
  ) {
    this.controls = this.category.map(c=> new FormControl(false));
    this.createNewMasterForm();
  }

  ngOnInit(){
    this.auth.getProfile().subscribe(res=>{
      // console.log(res['user'].u);
      this.username = res['user'].username;
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

  validateUserName(controls){
    if( controls.value.includes(true)){
      return null
    }else{
      return {
        'validateUserName':true}
    }
  }


  editTodo(todo) {
    // console.log(todo)
    this.editProcess = true;
    this.editControls = this.category.map(c=>new FormControl(false))
    let i = 0;
    this.category.forEach((el)=>{
      if(todo.skills.includes(el)){
        this.editControls[i].setValue(true);;
        i+=1;
      }else{
        i+=1;
      }
    })
    // console.log(this.editControls);
    this.formEdit = this.formBuilder.group({
      name: [todo.name, Validators.required],
      about: todo.about,
      skills: new FormArray(this.editControls,this.validateUserName)
    });
    if(this.allBlogs.includes(todo)){
      if(!this.editTodos.includes(todo)){
        this.editTodos.push(todo)
      }
    }
  }

  submitMaster(event,master){
    // console.log(master);
    
    if(event.keyCode == 13 && !this.formEdit.controls.name.errors && !this.formEdit.controls.skills.errors){
      const selectedOrderIds = this.formEdit.value.skills
      .map((v, i) => v ? this.category[i] : null)
      .filter(v => v !== null);
      this.processing = true;
      master.about = this.formEdit.get('about').value;
      master.name = this.formEdit.get('name').value;
      master.skills = selectedOrderIds;
      this.masterService.updateMaster(master).subscribe(res=>{
        if(!res['success']){
          this.message = res['message'];
          this.classMes = 'alert-danger';
          this.processing = false;
        }else{
          this.editProcess = false;
          this.message = res['message'];
          this.classMes = 'alert-success';
          this.masterService.getAllMasters(this.username).subscribe(res=>{
            this.editTodos.splice(this.editTodos.indexOf(master), 1);
            this.formEdit.reset();
            this.allBlogs = res['masters'];
            setTimeout(()=>{
              this.message = null;
              this.processing = false;
            },2000)
          })
        }
      })
    }
  }


  
  createNewMasterForm(){
    this.form = this.formBuilder.group({
      name:['',Validators.required],
      about:'',
      skills: new FormArray(this.controls,this.validateUserName)
    })
  }

  
  

  newMasterForm(){
    this.newPost = true;
  }

  onMasterSubmit(){
    this.processing = true;
    this.disableForm();
    const selectedOrderIds = this.form.value.skills
      .map((v, i) => v ? this.category[i] : null)
      .filter(v => v !== null);
    const master = {
      name: this.form.get('name').value,
      about: this.form.get('about').value,
      createdBy: this.username,
      skills: selectedOrderIds
    }
    this.masterService.newMaster(master).subscribe(res=>{
      if(!res['success']){
        this.classMes = 'alert-danger';
        this.message = res['message'];
        this.processing = false;
        this.enableForm();
      }else{
        this.classMes = 'alert-success';
        this.message = res['message'];
        this.masterService.getAllMasters(this.username)
          .subscribe(res=>{
            this.allBlogs = res['masters'];
          });
        setTimeout(()=>{
          this.newPost = false;
          this.processing = false;
          this.message = null;
          this.form.reset();
          this.enableForm();
        },2000)
      }
    })
  }

  goBack(){
    this.newPost = false;
    this.form.reset();
  }

  disableForm(){
    this.form.controls['name'].disable();
    this.form.controls['about'].disable();
    this.form.controls['skills'].disable();
  }

  enableForm(){
    this.form.controls['name'].enable();
    this.form.controls['about'].enable();
    this.form.controls['skills'].enable();
  }

  deleteMaster(id){
    if(window.confirm('Are you sure you want to delete this master?')){
      this.masterService.deleteMaster(id).subscribe(res=>{
        // console.log(res);
        this.classMes = 'alert-success';
        this.message = res['message'];
        this.masterService.getAllMasters(this.username).subscribe(res=>{
          this.allBlogs = res['masters'];
        });
        setTimeout(()=>{
          this.message = null;
        },2000)
      });
    }
  }

}
