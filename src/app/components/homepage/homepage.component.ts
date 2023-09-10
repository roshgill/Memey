// Import Modules from Angular Workspace and Firebase
import { Component, ViewChild, Renderer2, ElementRef} from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage, ref } from "firebase/storage";

import { LoadMemesParams } from 'src/app/interfaces/load-meme-params';
import { ThemeService } from '../../services/theme.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { MemeManagerService } from 'src/app/services/mememanager.service';
import { TweetManagerService } from 'src/app/services/tweetmanager.service';
import { FirebaseConfigurationService } from 'src/app/services/firebaseconfiguration.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent {

  selectedTweet0: string | undefined;
  selectedTweet1: string | undefined;
  @ViewChild('scrollcontainer', { static: true }) scrollcontainer!: ElementRef;
  @ViewChild('tweetContainer0', { static: true }) tweetContainer0!: ElementRef;
  @ViewChild('trendingContainer', { static: true }) trendingContainer!: ElementRef;

  constructor(private renderer2: Renderer2, private memesParams: LoadMemesParams, private themeService: ThemeService, public navigationService: NavigationService,
    private memeManagerService: MemeManagerService, private tweetManagerService: TweetManagerService, private firebaseConfigurationService: FirebaseConfigurationService ) {
      
      this.memesParams.firstTimeMemes = true;
      this.memesParams.imageNum = 5;
      this.memesParams.isLoading = false;
      this.memesParams.isDisabled = true;
      this.memesParams.promiseState = 'pending';
      this.firebaseConfigurationService.configureFirebase(this.memesParams);
      this.memesParams.memesListReference = ref(this.memesParams.storage, 'funny/');

      // Load initial images
      memeManagerService.loadInitialImages(this.memesParams);
  }

  ngOnInit() {
    let reloadIntervalId: any;
    const reloadInterval = 10;

    reloadIntervalId = setInterval(async () => { 
      const tweets = await this.tweetManagerService.randomizeTweet();
      this.selectedTweet0 = tweets.tweet0;
      this.selectedTweet1 = tweets.tweet1;
    }, reloadInterval * 1000);

    const checkHeightInterval = setInterval(() => {
      const tweetContainer0Height = this.tweetContainer0.nativeElement.offsetHeight;

      if (tweetContainer0Height !== 0) {
        const topPosition = ((-1) * (tweetContainer0Height + 100 - 7 - 117.8));
        this.renderer2.setStyle(this.trendingContainer.nativeElement, 'top', `${topPosition}px`);
        clearInterval(checkHeightInterval);
      }
    }, 1000); // Check every 1000ms
  }

  // Define a method to handle the scroll down event
  onScroll(event: any) {
    // Check if the promise state is 'loaded', if it's not loading, and if the length of the memeImages array is less than 500
    if (this.memesParams.promiseState == 'loaded' && !this.memesParams.isLoading && this.memesParams.memeImages.length < 500) {
      this.memesParams.isLoading = true;
      this.memeManagerService.loadMemes(this.memesParams).then(() => {
        this.memesParams.isLoading = false;
      });
    }
  }

  displayMemesByCategory(category: string) {
    this.memeManagerService.resetData(this.memesParams);
    this.memesParams.memesListReference = ref(this.memesParams.storage, category + '/');
    this.memeManagerService.loadInitialImages(this.memesParams)
    this.scrollcontainer.nativeElement.scrollTop = 0;
  }

  enableDarkTheme() {
    this.themeService.enableDarkTheme();
  }

  enableColorTheme() {
    this.themeService.enableColorTheme();
  }
}