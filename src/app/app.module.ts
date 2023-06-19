import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMasonryModule } from 'ngx-masonry';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CdkScrollingComponent } from './cdk-scrolling/cdk-scrolling.component';
import { AboutUsComponent } from './about-us/about-us.component';

@NgModule({
  declarations: [
    AppComponent,
    CdkScrollingComponent,
    AboutUsComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxMasonryModule,
    ScrollingModule,
    InfiniteScrollModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage())
  ],
  schemas: [],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}