import {RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import {HomeComponent} from './home/home.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuard} from './services/auth-guard.service';
import {AntiAuthGuard}  from './services/antiAuth-guard.service';
import {BlogComponent} from './blog/blog.component';
import {CheduleComponent} from './chedule/chedule.component';
import {BusinessGuard} from './services/business.guard';
import {BookingComponent} from './booking/booking.component';
import {ClientGuard} from './services/client.guard';
import {BookingBusinessComponent} from './booking-business/booking-business.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard,BusinessGuard]
  },
  {
    path: 'register', 
    component: RegisterComponent,
    canActivate: [AntiAuthGuard]
  },
  {
    path: 'login', 
    component: LoginComponent,
    canActivate: [AntiAuthGuard]
  },
  {
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'blog',
    component: BlogComponent
  },
  {
    path: 'schedule',
    component: CheduleComponent,
    canActivate: [AuthGuard,BusinessGuard]
  },
  {
    path: 'booking',
    component: BookingComponent,
    canActivate: [AuthGuard,ClientGuard]
  },
  {
    path: 'bookingBusiness',
    component: BookingBusinessComponent,
    canActivate: [AuthGuard, BusinessGuard]
  },
  {path: '**', component: HomeComponent}
  
];

@NgModule({
    declarations: [],
    imports: [
      RouterModule.forRoot(
        appRoutes
      )
    ],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
  })
  
export class AppRoutingModule { }
  