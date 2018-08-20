import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthService} from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {AuthGuard} from './services/auth-guard.service';
import {AntiAuthGuard} from './services/antiAuth-guard.service';
import { BlogComponent } from './blog/blog.component';
import { MaterializeModule } from 'angular2-materialize';
import {BlogService} from './services/blog.service';
import {MasterService} from './services/master.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlashMessagesModule.forRoot(),
    MaterializeModule
  ],
  providers: [AuthService,AuthGuard,AntiAuthGuard,BlogService,MasterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
