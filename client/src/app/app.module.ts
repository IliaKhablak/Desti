import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
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
import {WebsocketService} from './services/websocket.service';
import {ChatService} from './services/chat.service';
import { CheduleComponent } from './chedule/chedule.component';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import {ScheduleService} from './services/schedule.service';
import {BusinessGuard} from './services/business.guard';
import { BookingComponent } from './booking/booking.component';
import {ClientGuard} from './services/client.guard';
import { BookingBusinessComponent } from './booking-business/booking-business.component';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    CheduleComponent,
    BookingComponent,
    BookingBusinessComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlashMessagesModule.forRoot(),
    MaterializeModule,
    FormsModule,
    AngularDateTimePickerModule,
    FileUploadModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    AntiAuthGuard,
    BlogService,
    MasterService,
    WebsocketService,
    ChatService,
    ScheduleService,
    BusinessGuard,
    ClientGuard
    // JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
