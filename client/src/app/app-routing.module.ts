import {RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import {HomeComponent} from './home/home.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RegisterComponent} from './register/register.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'register', component: RegisterComponent},
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
  