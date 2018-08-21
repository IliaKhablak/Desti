import { Component, OnInit } from '@angular/core';
import {MaterializeDirective} from "angular2-materialize";
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {trigger, animate, transition, style} from '@angular/animations';
import {AuthService} from '../services/auth.service';
import {BlogService} from '../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
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
    )]
})
export class BlogComponent implements OnInit {

  message:string;
  classMes:string;
  newPost = false;
  loadingBlog = false;
  form: FormGroup;
  processing = false;
  userName;
  allBlogs;
  searchBloogs = [];

  constructor(
    private formBuilder:FormBuilder,
    private auth:AuthService,
    private blogService:BlogService
  ) {
    this.createNewBlogForm();
  }

  createNewBlogForm(){
    this.form = this.formBuilder.group({
      title:['',Validators.required],
      body: ['',Validators.required]
    })
  }

  newBlogForm(){
    this.newPost = true;
  }

  searchBlog(event){
    this.searchBloogs = [];
    if(!event){
      this.searchBloogs = [];
    }else{
      this.blogService.findBlog(event).subscribe(res=>{
        this.searchBloogs = res['blog']
      })
    }
  }

  // searchBlog(value){
  //   this.searchBloogs = [];
  //    if(!value){this.searchBloogs = [];}else{
  //      this.searchBloogs = this.allBlogs.filter(item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1);     } 
  // }

  reloadBlog(){
    this.loadingBlog = true;
    this.getAllBlogs(); 
    setTimeout(()=>{
      this.loadingBlog = false;
    },4000)
  }

  onBlogSubmit(){
    this.processing = true;
    this.disableForm();
    const blog = {
      title: this.form.controls['title'].value,
      body: this.form.controls['body'].value,
      createdBy: this.userName
    }
    this.blogService.newBlog(blog).subscribe(res=>{
       if(!res['success']){
         this.classMes = 'alert-danger';
         this.message = res['message'];
         this.processing = false;
         this.enableForm();
       }else{
         this.classMes = 'alert-success';
         this.message = res['message'];
         this.getAllBlogs();
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
    this.form.controls['title'].disable();
    this.form.controls['body'].disable();
  }

  enableForm(){
    this.form.controls['title'].enable();
    this.form.controls['body'].enable();
  }

  ngOnInit() {
    if(this.auth.loggedIn()){
      this.auth.getProfile().subscribe(res=>{
        this.userName = res['user'].username;
      });
    }
    this.getAllBlogs();
  }

  getAllBlogs(){
    this.blogService.getAllBlogs().subscribe(res=>{
      console.log(res['blogs']);
      this.allBlogs = res['blogs'];
    })
  }

  deleteBlog(id){
    if(window.confirm('Are you sure you want to delete this blog?')){
      this.blogService.deleteBlog(id).subscribe(res=>{
        // console.log(res);
        this.classMes = 'alert-success';
        this.message = res['message'];
        this.getAllBlogs();
        setTimeout(()=>{
          this.message = null;
        },2000)
      });
    }
    // console.log(id);
  }
}