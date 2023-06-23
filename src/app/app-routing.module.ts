import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { CdkScrollingComponent } from './cdk-scrolling/cdk-scrolling.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { DmcaComponent } from './dmca/dmca.component'; 
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  { path: 'cdk-scrolling', component: CdkScrollingComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'home-page', component: HomepageComponent },
  { path: 'dmca', component: DmcaComponent },
  { path: 'terms-conditions', component: TermsAndConditionsComponent },
  { path: '', redirectTo: '/home-page', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
