// Import necessary libraries, services and directives from Angular, Firebase and ngx-masonry
import { Component, ViewChild, Renderer2, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, list, getDownloadURL, getMetadata } from "firebase/storage";

import { NavigationService } from 'src/app/services/navigation.service';

// Define the Angular component, including its selector, CSS file and HTML template
@Component({
  selector: 'app-cdk-scrolling',
  styleUrls: ['cdk-scrolling.component.css'],
  templateUrl: 'cdk-scrolling.component.html',
})

// Define the class for the Angular component
export class CdkScrollingComponent {
  
  // Set configuration options for the masonry grid layout
  public masonryOptions: NgxMasonryOptions = {
    horizontalOrder: true,
    percentPosition: true,
    gutter: 0,
  };

  // Initialize various variables to manage image fetching and displaying
  masonryImages: { title: string, imageUrl: string, color: string, betaUsername: string }[] = [];  
  colors = ['#ED3833', '#1645F5', '#6DED8A', '#F0F14E', '#FF5F85'];
  
  memesListReference: any;
  gifsListReference: any;
  memespageToken: string | undefined;
  gifspageToken: string | undefined;
  initialLoadComplete: Promise<void> | undefined;
  promiseState = 'pending';
  firsttimememes = true;
  firsttimegifs = true;
  isLoading = false;

  isPaneVisible = false;
  public shouldHideContents = false;
  public isScrolled = false;

  scrollTimeout: any;
  memeCount = 0;

  // Use ViewChild to get references to certain elements in the component's template
  @ViewChildren('colorDiv') colorDivs!: QueryList<ElementRef>;
  @ViewChild('scrollableDiv', {static: true}) scrollableDiv!: ElementRef;

  // Set up the Firebase app and get references to the Firebase storage buckets for memes and gifs
  constructor(private renderer: Renderer2, public navigationService: NavigationService) {
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

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  this.memesListReference = ref(storage, 'funny/');
  this.gifsListReference = ref(storage, 'gifs/');

  this.loadInitialImages();
  }

  // Load an initial set of images when the component is created
  async loadInitialImages() {
    const memeBatchSize = 10;
    const gifBatchSize = 10;
  
    for (let i = 0; i < 5; i++) {
      await this.loadMemes(memeBatchSize);
      await this.loadGifs(gifBatchSize);
    }
  }

  // Define an asynchronous function to load a set number of meme images from Firebase
  async loadMemes(image_num: number) {
  // Functionality simply handles the first time meme database is accessed 
  if (!this.firsttimememes && !this.memespageToken) 
    return;
  
  let firstPage;
  if (this.firsttimememes == true) 
  {
    //Place all urls into firstPage
    firstPage = await list(this.memesListReference, { maxResults: image_num });
    this.firsttimememes = false;
  }
  else {
    firstPage = await list(this.memesListReference, { maxResults: image_num, pageToken: this.memespageToken});
  }

  this.memespageToken = firstPage.nextPageToken;

    // Process each item in the first page
    firstPage.items.forEach((itemRef: any) => {
      // Get the reference URL for each item
      getDownloadURL(itemRef)
      .then((url) => {
        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        /*
          The xhr.onload function is a callback function. It's a set of instructions to the xhr 
          object to follow when the image fetching is completed. While waiting for the image 
          to load, your code can continue executing other tasks, and when the image is loaded 
          (the event), the xhr.onload function is called (executed) to process the image data.
          */
          // Define the onload function for the XMLHttpRequest object
          xhr.onload = () => {
          // Create a blob from the response
          const blob = xhr.response;
          // Create an image URL from the blob
          const imageUrl = URL.createObjectURL(blob);
          // Add the image to the masonryImages array
          getMetadata(itemRef)
          .then((metadata) => {
            let betaUser = metadata.customMetadata ? metadata.customMetadata['beta-username'] : '';
            this.masonryImages.push({ title: itemRef.name, imageUrl: imageUrl, color: this.getRandomColor(), betaUsername: betaUser });
          })            
          .catch((error) => {
            console.error('Error fetching metadata:', error);
          });
        }
        // Open the XMLHttpRequest object with the GET method and the Google Cloud reference URL
        xhr.open('GET', url);
        // Send the XMLHttpRequest
        xhr.send();
      })
      // Catch any errors that occur during the process
      .catch((error) => {
        console.error('Error fetching image:', error);
      });
    if (!this.initialLoadComplete) {
      this.initialLoadComplete = Promise.resolve();
      this.promiseState = 'loaded';
    }
  });
}

  // Define an asynchronous function to load a set number of gif images from Firebase
  async loadGifs(image_num: number) {

    let firstPage;

    if (!this.firsttimegifs && !this.gifspageToken)
      return;
      
    if (this.firsttimegifs == true)
    {
      firstPage = await list(this.gifsListReference, { maxResults: image_num })
      this.firsttimegifs = false;
    }
    else {
      firstPage = await list(this.gifsListReference, {maxResults: image_num, pageToken: this.gifspageToken });
    }

    this.gifspageToken = firstPage.nextPageToken;
    // Process each item in the first page
    firstPage.items.forEach((itemRef: any) => {
      // Get the reference URL for each item
      getDownloadURL(itemRef)
        .then((url) => {
          // Create a new XMLHttpRequest object
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          /*
            The xhr.onload function is a callback function. It's a set of instructions to the xhr 
            object to follow when the image fetching is completed. While waiting for the image 
            to load, your code can continue executing other tasks, and when the image is loaded 
            (the event), the xhr.onload function is called (executed) to process the image data.
          */
          // Define the onload function for the XMLHttpRequest object
          xhr.onload = () => {
            // Create a blob from the response
            const blob = xhr.response;
            // Create an image URL from the blob
            const imageUrl = URL.createObjectURL(blob);
            // Add the image to the masonryImages array
            getMetadata(itemRef)
            .then((metadata) => {
              let betaUser = metadata.customMetadata ? metadata.customMetadata['beta-username'] : '';
              console.log(betaUser);
              this.masonryImages.push({ title: itemRef.name, imageUrl: imageUrl, color: this.getRandomColor(), betaUsername: betaUser });
            })            
            .catch((error) => {
              console.error('Error fetching metadata:', error);
            });
          }

          // Open the XMLHttpRequest object with the GET method and the Google Cloud reference URL
          xhr.open('GET', url);
          // Send the XMLHttpRequest
          xhr.send();
        })
        // Catch any errors that occur during the process
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
    });
  }

  // Listen for scroll events on the window object, and load more images when certain conditions are met
  onScroll(event: any) {
    
    // Iterate over the colorDivs array and check if the div is in the view
    // this.colorDivs.forEach(div => this.checkIfInView(div));
    // this.colorDivs.forEach(div => this.checkIfIntersecting(div));
    
    // If there is a scroll timeout already set, clear it
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Set a Timeout for 200 milliseconds
    this.scrollTimeout = setTimeout(() => {
      // Get the scroll position. Prioritizes window.scrollY, if that is not present, falls back to document.documentElement.scrollTop, document.body.scrollTop and 0
      const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      // Get the window height
      const windowHeight = window.innerHeight;
      // Get the total height of the document
      const documentHeight = document.documentElement.scrollHeight;

      /* 
      If the current scroll position plus the window height is more than 70% of the document height.
      And the previous promise for loading images is loaded.
      And it's not currently loading images. 
      And masonryImages array has less than 1000 elements.
      */
      // Call loadMemes and loadGifs 
      if (this.promiseState == 'loaded' && !this.isLoading && this.masonryImages.length < 1000) {
        this.isLoading = true;
        this.loadMemes(15).then(() => {
          this.memeCount += 2;
          this.isLoading = false;
          if (this.memeCount % 4 == 0) {
            this.loadGifs(5).then(() => {
            });
          }
        });
      }
    }, 200);
  }

  ngAfterViewInit() {
    this.colorDivs.changes.subscribe((comps: QueryList<ElementRef>) => {

    // Create a new Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // If the div is in the viewport, add the 'transition' class
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'transition');
        } 
        // If the div is not in the viewport, remove the 'transition' class
        else {
          this.renderer.removeClass(entry.target, 'transition');
        }
      });
    }, { threshold: 0.1 }); // Configure the observer to trigger when at least 10% of the div is visible

      // Use the Intersection Observer on each div
      comps.forEach(div => observer.observe(div.nativeElement));
    });
  }
    
  // Returns random color from provided colors list
  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }
}