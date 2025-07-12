import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EventregistrationmasterComponent } from './eventregistrationmaster/eventregistrationmaster.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ThankyoupageComponent } from './thankyoupage/thankyoupage.component';
import { LayoutComponent } from './layout/layout.component';
import { ClientlistComponent } from './clientlist/clientlist.component';
import { AuthGuard } from './auth.guard';

// const routes: Routes = [

//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'eventRegistrationForm', component: EventregistrationmasterComponent },
//   { path: 'thankyou', component: ThankyoupageComponent },
// ];
//  { path: '**', redirectTo: 'eventRegistrationForm' },//default login page
// This path is relative to the root. If it's an empty path, it means default.
// This component contains the sidebar and <router-outlet>
const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },//default login page
  { path: 'registration', component: EventregistrationmasterComponent },
  { path: 'login', component: LoginComponent },
  {path: '', component: LayoutComponent, 
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'clientlist', component: ClientlistComponent, canActivate: [AuthGuard] },
    ], canActivate: [AuthGuard]
  },
  { path: 'thankyou', component: ThankyoupageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
