import { Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {MasterService} from '../services/master.service';
import {FormControl, FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {trigger, animate, transition, style} from '@angular/animations';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';


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

  user;
  message:string;
  classMes:string;
  newPost = false;
  loadingBlog = false;
  form;
  processing = false;
  userName;
  allBlogs;
  searchBloogs = [];
  controls;
  category = [];
  username;
  editTodos = [];
  formEdit;
  editControls;
  editProcess = false;
  newCatTriger = false;
  checkCat = true;
  values = '';
  inpValue;
  selectedFile: File = null;
  public uploader: FileUploader;
  attachmentList:any = [];

  constructor(
    public auth:AuthService,
    private masterService:MasterService,
    private formBuilder:FormBuilder
  ) {
    this.auth.loadToken();
    this.uploader = new FileUploader({url: this.auth.domain+'/masters/imgUpload',authToken:this.auth.authToken});
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item:any,response:any,status:any,headers:any)=>{
      // console.log(response);
      this.attachmentList.push(JSON.parse(response));
    }
    this.masterService.getAllCategories().subscribe(res=>{
      this.category = res['categories'].category;
      this.controls = this.category.map(c=> new FormControl(false));
      this.createNewMasterForm();
    })
  }

  // updateCat(){
  //   this.masterService.getAllCategories().subscribe(res=>{
  //     // console.log(res);
  //     this.category = res['categories'].category;
  //     this.controls = this.category.map(c=> new FormControl(false));
  //   })
  // }

  onFileChanged(event) {
    this.selectedFile = <File>event.target.files[0]
  }

  onUpload(){
    const fb = new FormData();
    fb.append('image',this.selectedFile,this.selectedFile.name);
    this.masterService.uploadImage(fb).subscribe(res=>console.log(res));
  }

  ngOnInit(){
    if(this.auth.user.value === null){
      this.auth.getUser();
      this.auth.user.subscribe(res=>this.user = res)
    }else{
      this.auth.user.subscribe(res=>this.user = res)
    }
    // this.uploader = new FileUploader({url: this.auth.domain+'/masters/imgUpload', itemAlias: 'photo',authToken:this.auth.authToken});
    // this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };  
    // this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    //      console.log('ImageUpload:uploaded:', item, status, response);
    //      alert('File uploaded successfully');
    //  };
    this.username = this.user.username;
    this.masterService.getAllMasters().subscribe(res=>{
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
      skills: new FormArray(this.editControls,this.validateUserName),
      newCatTriger:false,
      values:''
    });
    if(this.allBlogs.includes(todo)){
      if(!this.editTodos.includes(todo)){
        this.editTodos.push(todo)
      }
    }
  }

  onKeyPress(event,param){
    if(event.keyCode == 13 && this.checkCat){
      let category = {
        category: this.values.toLowerCase()
      }
      this.masterService.newCategory(category)
        .subscribe(res=>{
          if(res['success']){
            this.classMes = 'alert-success';
            this.message = res['message'];
            // let newOne = this.values;
            this.values = '';
            this.category = res['category'].category;
            this.controls = this.category.map(c=> new FormControl(false));
            // this.inpValue = '';
            if(!param){
              // this.myInput2.nativeElement.value = '';
              this.formEdit.controls['values'].setValue('');
              this.formEdit.controls['newCatTriger'].setValue(false);
              this.formEdit.controls['skills'].push(this.controls[this.controls.length - 1]);
            }else{
              // this.myInput.nativeElement.value = '';
              this.form.controls['values'].setValue('');
              this.form.controls['newCatTriger'].setValue(false);
              this.form.controls['skills'].push(this.controls[this.controls.length - 1]);
            }
            setTimeout(()=>{
              this.message = null;
            },2000)
          }else{
            this.classMes = 'alert-danger';
            this.message = res['message'];
          }
        });
    }
  }

  onSearchChange(event){
    this.values = event.target.value;
    if(this.category.indexOf(event.target.value.toLowerCase()) > -1){
      this.checkCat = false;
    }else{
      this.checkCat = true;
    }
  }

  // onSearchChange2(event){
  //   this.values = event.target.value;
  //   if(this.category.indexOf(event.target.value.toLowerCase()) > -1){
  //     this.checkCat = false;
  //   }else{
  //     this.checkCat = true;
  //   }
  // }


  submitMaster(event,master){
    if(event.keyCode == 13 && !this.formEdit.controls.name.errors && !this.formEdit.controls.skills.errors && !this.formEdit.get('newCatTriger').value){
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
          this.masterService.getAllMasters().subscribe(res=>{
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
      skills: new FormArray(this.controls,this.validateUserName),
      newCatTriger:false,
      values:''
    })
  }

  
  

  newMasterForm(){
    this.newPost = true;
  }

  onMasterSubmit(){
    // console.log(this.selectedFile);
    this.processing = true;
    // this.disableForm();
    const selectedOrderIds = this.form.value.skills
      .map((v, i) => v ? this.category[i] : null)
      .filter(v => v !== null);
    const master = {
      name: this.form.get('name').value,
      about: this.form.get('about').value,
      createdBy: this.username,
      skills: selectedOrderIds
    }
    // console.log(master);
    this.masterService.newMaster(master).subscribe(res=>{
      if(!res['success']){
        this.classMes = 'alert-danger';
        this.message = res['message'];
        this.processing = false;
        console.log(res['message']);
        // this.enableForm();
      }else{
        this.classMes = 'alert-success';
        this.message = res['message'];
        this.masterService.getAllMasters()
          .subscribe(res=>{
            this.allBlogs = res['masters'];
          });
        setTimeout(()=>{
          this.newPost = false;
          this.processing = false;
          this.message = null;
          this.form.reset();
          this.attachmentList = [];
          this.uploader.queue = [];
          // this.enableForm();
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
        this.masterService.getAllMasters().subscribe(res=>{
          this.allBlogs = res['masters'];
        });
        setTimeout(()=>{
          this.message = null;
        },2000)
      });
    }
  }

}
