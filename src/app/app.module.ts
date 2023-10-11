import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMasonryModule } from 'ngx-masonry';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { CdkScrollingComponent } from './components/cdk-scrolling/cdk-scrolling.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { DmcaComponent } from './components/dmca/dmca.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { NotSupportedComponent } from './components/not-supported/not-supported.component';
import { ThemeDirective } from './directives/theme/theme.directive';
import { MemeGeneratorComponent } from './components/meme-generator/meme-generator.component';
import { ContentCleanComponent } from './content-clean/content-clean.component';

@NgModule({
  declarations: [
    AppComponent,
    CdkScrollingComponent,
    AboutUsComponent,
    HomepageComponent,
    DmcaComponent,
    TermsAndConditionsComponent,
    NotSupportedComponent,
    ThemeDirective,
    MemeGeneratorComponent,
    ContentCleanComponent,
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
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore())
  ],
  schemas: [],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}