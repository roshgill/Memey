import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { CdkScrollingComponent } from './cdk-scrolling/cdk-scrolling.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { DmcaComponent } from './dmca/dmca.component'; 
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { NotSupportedComponent } from './not-supported/not-supported.component';
import { TestingComponent } from './testing/testing.component';
import { MemeGeneratorComponent } from './meme-generator/meme-generator.component';

const routes: Routes = [
  { path: 'dungeon', component: CdkScrollingComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'dmca', component: DmcaComponent },
  { path: 'terms-conditions', component: TermsAndConditionsComponent },
  { path: 'not-supported', component: NotSupportedComponent },
  { path: 'testing', component: TestingComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
