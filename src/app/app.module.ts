import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import {appRoutingProviders, routing} from './route';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { MusicdivisionComponent } from './musicdivision/musicdivision.component';
import { WebookComponent } from './webook/webook.component';
import { WhoWeAreComponent } from './who-we-are/who-we-are.component';
import { MusicvideosComponent } from './musicvideos/musicvideos.component';
import { ModelandtalentComponent } from './modelandtalent/modelandtalent.component';
import { TrendingmodelsComponent } from './trendingmodels/trendingmodels.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageadminComponent } from './manageadmin/manageadmin.component';
import { AddadminComponent } from './addadmin/addadmin.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { AdminleftComponent } from './adminleft/adminleft.component';
import { EditadminComponent } from './editadmin/editadmin.component';
import { AdminheaderComponent } from './adminheader/adminheader.component';
import { BrandlistingComponent } from './brandlisting/brandlisting.component';
import { OfferlistingComponent } from './offerlisting/offerlisting.component';
import { InfluencerlistingComponent } from './influencerlisting/influencerlisting.component';
import { InfluencelistComponent } from './influencelist/influencelist.component';
import { BrandlistComponent } from './brandlist/brandlist.component';
import { OldhomeComponent } from './oldhome/oldhome.component';
import { OldheaderComponent } from './oldheader/oldheader.component';
import { OldfooterComponent } from './oldfooter/oldfooter.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { EventsComponent } from './events/events.component';
import { NavbariconComponent } from './navbaricon/navbaricon.component';
import { PartnersComponent } from './partners/partners.component';
import { BecomeAModelComponent } from './become-a-model/become-a-model.component';
import { OurModelsComponent } from './our-models/our-models.component';
import { ModelProfileComponent } from './model-profile/model-profile.component';
import { ModelMarketingComponent } from './model-marketing/model-marketing.component';
import { OldmusicvideosComponent } from './oldmusicvideos/oldmusicvideos.component';
import { MusicManagementComponent } from './music-management/music-management.component';
import { MarketingManagementComponent } from './marketing-management/marketing-management.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { Resolveservice } from '../app/resolveservice';



import { DragScrollModule } from 'ngx-drag-scroll';
import {ApiService} from './api.service';
import {AuthGuard} from './auth.guard';
import {NgxUploaderModule} from 'ngx-uploader';
import { UploaderComponent } from './uploader/uploader.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    MusicdivisionComponent,
    WebookComponent,
    WhoWeAreComponent,
    MusicvideosComponent,
    ModelandtalentComponent,
    TrendingmodelsComponent,
    LoginComponent,
    DashboardComponent,
    ManageadminComponent,
    AddadminComponent,
    MyaccountComponent,
    AdminleftComponent,
    EditadminComponent,
    AdminheaderComponent,
    BrandlistingComponent,
    OfferlistingComponent,
    InfluencerlistingComponent,
    InfluencelistComponent,
    BrandlistComponent,
    OldhomeComponent,
    OldheaderComponent,
    OldfooterComponent,
    SidemenuComponent,
    EventsComponent,
    NavbariconComponent,
    PartnersComponent,
    BecomeAModelComponent,
    OurModelsComponent,
    ModelProfileComponent,
    ModelMarketingComponent,
    OldmusicvideosComponent,
    MusicManagementComponent,
    MarketingManagementComponent,
    ContactUsComponent,
    UploaderComponent,

  ],
  imports: [
    DragScrollModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    NgxUploaderModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot()
  ],

  bootstrap: [AppComponent],
  providers: [CookieService, Resolveservice, ApiService, AuthGuard],
})
export class AppModule { }
