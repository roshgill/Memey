import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { CdkScrollingComponent } from './components/cdk-scrolling/cdk-scrolling.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { DmcaComponent } from './components/dmca/dmca.component'; 
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { NotSupportedComponent } from './components/not-supported/not-supported.component';
import { MemeGeneratorComponent } from './components/meme-generator/meme-generator.component';
import { ContentCleanComponent } from './content-clean/content-clean.component';

const routes: Routes = [
  { path: 'content-clean', component: ContentCleanComponent },
  { path: 'dungeon', component: CdkScrollingComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'dmca', component: DmcaComponent },
  { path: 'terms-conditions', component: TermsAndConditionsComponent },
  { path: 'not-supported', component: NotSupportedComponent },
  { path: 'meme-generator', component: MemeGeneratorComponent },
  { path: '', component: ContentCleanComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
