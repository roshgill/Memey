// Angular & Firebase imports
import { Component, ViewChild, Renderer2, ElementRef} from '@angular/core';
import { ref } from "firebase/storage";

// App-specific imports
import { FirebaseConfigurationService } from 'src/app/services/firebaseconfiguration.service';
import { LoadMemesParams } from 'src/app/interfaces/load-meme-params';
import { NavigationService } from 'src/app/services/navigation.service';
import { MemeManagerService } from 'src/app/services/mememanager.service';
import { ThemeService } from 'src/app/services/theme.service';
import { TweetManagerService } from 'src/app/services/tweetmanager.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent {

  // Selected tweets for display
  selectedTweet0: string | undefined;
  selectedTweet1: string | undefined;

  // ViewChildren for accessing DOM elements
  @ViewChild('scrollcontainer', { static: true }) scrollcontainer!: ElementRef;
  @ViewChild('trendingContainer', { static: true }) trendingContainer!: ElementRef;
  @ViewChild('tweetContainer0', { static: true }) tweetContainer0!: ElementRef;

  // Parameters related to memes loading
  memesParams: LoadMemesParams = {
    firstTimeMemes: true,
    imageNum: 25,
    isLoading: false,
    isDisabled: true,
    initialLoadComplete: undefined,
    memesPageToken: undefined,
    memesListReference: undefined,
    memeImages: [],
    promiseState: 'pending',
    storage: undefined,
  };

  constructor
  ( 
    private renderer2: Renderer2, 
    private firebaseConfigurationService: FirebaseConfigurationService, 
    private themeService: ThemeService, 
    public navigationService: NavigationService,
    private memeManagerService: MemeManagerService, 
    private tweetManagerService: TweetManagerService 
  ) {     
      // Initialize storage and reference from Firebase
      this.memesParams.storage = this.firebaseConfigurationService.configureFirebase();
      this.memesParams.memesListReference = this.firebaseConfigurationService.referenceFirestoreDatabase(this.memesParams.storage, 'funny' + '/');
      
      // Load the initial set of images
      memeManagerService.loadInitialImages(this.memesParams);
  }

  ngOnInit() {
    const tweets = this.tweetManagerService.randomizeTweet();
    this.selectedTweet0 = tweets.tweet0;
    this.selectedTweet1 = tweets.tweet1;

    // Check the height of the tweet container every second: Stick trending container midway based off tweetContainer0 Height
    const checkHeightInterval = setInterval(() => {
      const tweetContainer0Height = this.tweetContainer0.nativeElement.offsetHeight;

      if (tweetContainer0Height !== 0) {
        const topPosition = ((-1) * (tweetContainer0Height + 100 - 7 - 117.8));
        this.renderer2.setStyle(this.trendingContainer.nativeElement, 'top', `${topPosition}px`);
        clearInterval(checkHeightInterval);
      }
    }, 1000);
  }

  // Handle the scroll down event to load more memes
  onScroll(event: any) {
    if (this.memesParams.promiseState == 'loaded' && !this.memesParams.isLoading && this.memesParams.memeImages.length < 500) {
      this.memesParams.isLoading = true;
      this.memeManagerService.loadMemes(this.memesParams).then(() => {
        this.memesParams.isLoading = false;
      });
    }
  }

  // Define a method to handle the meme category selection events
  displayMemesByCategory(category: string) {
    this.memeManagerService.resetData(this.memesParams);
    this.memesParams.memesListReference = this.firebaseConfigurationService.referenceFirestoreDatabase(this.memesParams.storage, category + '/');
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