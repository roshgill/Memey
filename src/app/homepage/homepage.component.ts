// Import necessary modules from Angular and Firebase
import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, list, getDownloadURL, getMetadata } from "firebase/storage";
import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { filter, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { Subject, of, timer } from 'rxjs';
import { interval, Subscription } from 'rxjs';

import { ThemeService } from '../theme.service';


// Define the component metadata
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

// Define the HomepageComponent class
export class HomepageComponent {

  tweetList: string[] = [
    'https://twitter.com/cb_doge/status/1678399673407504386?ref_src=twsrc%5Etfw',
    'https://twitter.com/DeadpoolUpdate/status/1678427696580231168',
    'https://twitter.com/PokemonGoApp/status/1678143240694816768',
    'https://twitter.com/Mlickles/status/1678208813684465667',
    'https://twitter.com/PokemanZ0N6/status/1678468426950483968',
    'https://twitter.com/BillyM2k/status/1678439033641529344',
    'https://twitter.com/MattWallace888/status/1678098475915919360',
    'https://twitter.com/upblissed/status/1678250341417009153',
    'https://twitter.com/upblissed/status/1678135296150347779',
    'https://twitter.com/DankMemesGlobal/status/1246868153683939334',
    'https://twitter.com/DankMemesGlobal/status/1338158985640255493',
    'https://twitter.com/theMemesBot/status/1672283558294196224',
    'https://twitter.com/buitengebieden/status/1678454914484248599',
    'https://twitter.com/Slakonbothsides/status/1678040395580686336',
    'https://twitter.com/contextdogs/status/1678095092727308290',
    'https://twitter.com/barstoolsports/status/1678130723717365762',
    'https://twitter.com/BillyM2k/status/1677737855827988480'
  ];

  public selectedTweet: string | undefined;
  private subscription!: Subscription;
  reloadIntervalId: any;

  private destroy$ = new Subject<void>();

  // Define properties for the component
  memeImages: { title: string, imageUrl: string, betaUsername: string }[] = [];  
  memesListReference: any;
  initialLoadComplete: Promise<void> | undefined;
  promiseState = 'pending';
  firsttimememes = true;
  isLoading = false;
  isDisabled = true;
  memespageToken: string | undefined;
  storage: any;
  @ViewChild('scrollcontainer', { static: true }) scrollcontainer!: ElementRef;

  // Define the constructor for the component, which initializes Firebase and loads initial images
  constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute, private themeService: ThemeService, private changeDetector: ChangeDetectorRef) {
    const firebaseConfig = {
      projectId: 'memey-e9b65',
      appId: '1:693078826607:web:25689a779fc6b129bf779a',
      storageBucket: 'gs://memey-bucket',
      locationId: 'us-central',
      apiKey: 'AIzaSyCEaqo_JnonmlskbDK30QOpVo3KdA-YZR4',
      authDomain: 'memey-e9b65.firebaseapp.com',
      messagingSenderId: '693078826607',
      measurementId: 'G-GDWWNE42TH',
    }
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
  
    this.memesListReference = ref(this.storage, 'funny/');    

    // Load initial images
    this.loadInitialImages();
  }

  ngOnInit() {
    this.randomizeTweet();
  
    const reloadInterval = 5;
    this.reloadIntervalId = setInterval(() => { this.randomizeTweet() }, reloadInterval * 1000);
  }
  
  ngOnDestroy() {
    if(this.reloadIntervalId) {
      clearInterval(this.reloadIntervalId);
    }
  }

  async randomizeTweet() {
    let randomIndex = Math.floor(Math.random() * this.tweetList.length);
    console.log("It Works");
    this.selectedTweet = this.tweetList[randomIndex];

    this.changeDetector.detectChanges();

    if ((window as any).twttr && (window as any).twttr.widgets) {
      (window as any).twttr.widgets.load();
    }
  }
  

  // Define a method to load initial images
  async loadInitialImages() {
    const memeBatchSize = 5;
  
    for (let i = 0; i < 5; i++) {
      await this.loadMemes(memeBatchSize);
    }
  }

  // Define a method to load memes
  async loadMemes(image_num: number) {
    
    let firstPage;

    // Check if it's the first time loading memes and if there's a page token
    if (!this.firsttimememes && !this.memespageToken) 
      return;
    if (this.firsttimememes == true) {
      firstPage = await list(this.memesListReference, { maxResults: image_num });
      this.firsttimememes = false;
    }
    else {
      firstPage = await list(this.memesListReference, { maxResults: image_num, pageToken: this.memespageToken});
    }

    // Update the page token
    this.memespageToken = firstPage.nextPageToken;

    // Process each item in the first page
    firstPage.items.forEach((itemRef: any) => {
      // Get the reference URL for each item
      getDownloadURL(itemRef)
        .then((url) => {
          // Create a new XMLHttpRequest object
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';

          // Define the onload function for the XMLHttpRequest object
          xhr.onload = () => {
            // Create a blob from the response
            const blob = xhr.response;
            // Create a image URL from the blob
            const imageUrl = URL.createObjectURL(blob);
            // Add the image to the memeImages array
            getMetadata(itemRef)
            .then((metadata) => {
              let betaUser = metadata.customMetadata ? metadata.customMetadata['beta-username'] : '';
              console.log(betaUser);
              this.memeImages.push({ title: itemRef.name, imageUrl: imageUrl, betaUsername: betaUser });
            })            
            .catch((error) => {
              console.error('Error fetching metadata:', error);
            });
          };

          // Open the XMLHttpRequest object with the GET method and the URL
          xhr.open('GET', url);
          // Send the XMLHttpRequest
          xhr.send();
        })
        // Catch any errors that occur during the process
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
      // If the initial load is not complete, complete it and update the promise state
      if (!this.initialLoadComplete) {
        this.initialLoadComplete = Promise.resolve();
        this.promiseState = 'loaded';
      }
    });
    console.log('Images are being fetched and processed');
    console.log(this.memeImages.length)
  }

  // Define a method to handle the scroll down event
  onScroll(event: any) {
    console.log("Scroll detected!");
    // Check if the promise state is 'loaded', if it's not loading, and if the length of the memeImages array is less than 500
    if (this.promiseState == 'loaded' && !this.isLoading && this.memeImages.length < 500) {
      this.isLoading = true;
      this.loadMemes(5).then(() => {
        this.isLoading = false;
      });
    }
  }

  resetData() {
    this.memeImages = [];  
    this.memesListReference = undefined;
    this.initialLoadComplete = undefined;
    this.promiseState = 'pending';
    this.firsttimememes = true;
    this.isLoading = false;
    this.isDisabled = true;
    this.memespageToken = undefined;
  }

  // Define a method to reload the page
  pageReload() {
    window.location.reload();
  }

  displayDankMemes() {
    this.resetData();
    this.memesListReference = ref(this.storage, 'dank/');
    this.loadInitialImages()
    this.scrollcontainer.nativeElement.scrollTop = 0;
  }

  displayGamingMemes() {
    this.resetData();
    this.memesListReference = ref(this.storage, 'gaming/');
    this.loadInitialImages()
    this.scrollcontainer.nativeElement.scrollTop = 0;
  }

  displayCryptoMemes() {
    this.resetData();
    this.memesListReference = ref(this.storage, 'crypto/');
    this.loadInitialImages()
    this.scrollcontainer.nativeElement.scrollTop = 0;
  }

  displaySportsMemes() {
    this.resetData();
    this.memesListReference = ref(this.storage, 'sports/');
    this.loadInitialImages()
    this.scrollcontainer.nativeElement.scrollTop = 0;
  }

  enableDarkTheme() {
    this.themeService.enableDarkTheme();
  }

  enableColorTheme() {
    this.themeService.enableColorTheme();
  }

  // Define a method to navigate to the dungeon page
  navigateToDungeon() {
    this.router.navigate(['/dungeon']);
  }

  // Define a method to navigate to the about us page
  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
    }

  // Define a method to navigate to the about us page
  navigateToDMCA() {
    this.router.navigate(['/dmca']);
    }
  
  navigateToTerms() {
    this.router.navigate(['/terms-conditions']);
    }
}
