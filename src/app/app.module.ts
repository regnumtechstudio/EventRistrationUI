import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { EventregistrationmasterComponent } from './eventregistrationmaster/eventregistrationmaster.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppHttpInterceptorService } from './services/app-http-interceptor.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ThankyoupageComponent } from './thankyoupage/thankyoupage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LayoutComponent } from './layout/layout.component';
import { ClientlistComponent } from './clientlist/clientlist.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EventregistrationmasterComponent,
    DashboardComponent,
    ThankyoupageComponent,
    LayoutComponent,
    ClientlistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
     provideClientHydration(withEventReplay()),
     { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptorService, multi: true },
     { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
