import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkScrollingComponent } from './cdk-scrolling/cdk-scrolling.component';
import { AboutUsComponent } from './about-us/about-us.component';

const routes: Routes = [
  { path: 'cdk-scrolling', component: CdkScrollingComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: '', redirectTo: '/cdk-scrolling', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
