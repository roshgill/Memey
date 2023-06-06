//Integrate necessary functions, decorators, directives, and services (tools)
import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, ElementRef, HostListener, ViewChildren, QueryList, Directive } from '@angular/core';
import { NgxMasonryOptions, NgxMasonryComponent } from 'ngx-masonry';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cdk-scrolling',
  styleUrls: ['cdk-scrolling.component.css'],
  templateUrl: 'cdk-scrolling.component.html',
})

export class CdkScrollingComponent {
  
  /*In the provided code snippet, the `masonryOptions` variable is an object that holds configuration 
  options for the `NgxMasonry` library, which is used to create a masonry grid layout for displaying images. 
  The options specified in the object are:*/
  public masonryOptions: NgxMasonryOptions = {
    horizontalOrder: true,
    percentPosition: true,
    gutter: 0,
  };

  //Purpose of masonryImages is to store images downloaded from Google Cloud Database
  //Purpose of colors array is to store different colors for transition effect
  //Purpose of listReference is to store the reference path to specific bucket/folder containing said data
  //Purpose of Promise variable intialLoadComplete is to first make certain to preload a certain number of images into masonryImages 
  //before scrolling-detection/incremental-fetching occurs
  //Purpose of isLoading to make sure loadImages is not called concurrently by downwards scrolling detector
  //pageToken is meant to check if all images in Google Cloud Storage bucket are downloaded; stops duplicate downloads
  //* Note: pageToken will not be taken into effect until storage costs are calculated for. Until then, manual masonryImages
  //length will be calculated for instead
  masonryImages: { title: string, imageUrl: string, color: string }[] = [];  
  colors = ['#ED3833', '#1645F5', '#6DED8A', '#F0F14E', '#FF5F85'];
  memesListReference: any; // Add memesListReference as a class property
  gifsListReference: any; // Add gifsListReference as a class property
  initialLoadComplete: Promise<void> | undefined;
  promiseState = 'pending';
  firsttimememes = true;
  firsttimegifs = true;
  isLoading = false;
  isPaneVisible = false;


  //A way to track of all the elements in your HTML with a 'colorDiv' reference
  @ViewChildren('colorDiv') colorDivs!: QueryList<ElementRef>;
  @ViewChild('scrollableDiv', {static: true}) scrollableDiv!: ElementRef;
  public shouldHideContents = false;
  public isScrolled = false;
  memespageToken: string | undefined;
  gifspageToken: string | undefined;

  /* 
  0. Renderer2 is intitialized in the constructor; making it available for use within the component's methods, 
  allowing DOM manipulations safely and consistently across different platforms.
  
  1. Firebase Configuration object data: This object contains the configuration settings required
  to initialize the Firebase app and connect to the Firebase project. The configuration settings
  include project ID, app ID, storage bucket URL, location ID, API key, authDomain, messaging
  sender ID, and measurement ID. These settings are used to set up the Firebase app and
  connect to Firebase services such as Firestore, Storage, and Authentication. 

  2. Initialize app and database/bucket

  3. Use asynch function to begin fetching specific number of images and appending into masonryImages using xhr
  */
  constructor(private renderer: Renderer2, private router: Router) {
    const firebaseConfig = {
      projectId: 'memey-e9b65',
      appId: '1:693078826607:web:25689a779fc6b129bf779a',
      //storageBucket: 'memey-e9b65.appspot.com',]
      storageBucket: 'gs://memey-bucket',
      locationId: 'us-central',
      apiKey: 'AIzaSyCEaqo_JnonmlskbDK30QOpVo3KdA-YZR4',
      authDomain: 'memey-e9b65.firebaseapp.com',
      messagingSenderId: '693078826607',
      measurementId: 'G-GDWWNE42TH',
  }

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  this.memesListReference = ref(storage, 'memes/');
  this.gifsListReference = ref(storage, 'gifs/');
  // Log the list reference
  console.log('List reference:', this.memesListReference); 
  //var image_num = 20;

  this.loadInitialImages();
  }

  async loadInitialImages() {
    const memeBatchSize = 4;
    const gifBatchSize = 10;
  
    for (let i = 0; i < 5; i++) { // Load 40 memes and 10 gifs in total
      await this.loadGifs(gifBatchSize);
      await this.loadMemes(memeBatchSize);
    }
  }

  async loadMemes(image_num: number) {
  //This starting functionality simply handles the first time meme database is accessed 
  if (!this.firsttimememes && !this.memespageToken) 
    return;
  
  let firstPage;
  if (this.firsttimememes == true) 
  {
    //First time meme database is accessed
    //Place all urls into firstPage
    firstPage = await list(this.memesListReference, { maxResults: image_num });
    this.firsttimememes = false;
  }
  else {
    //Every other time meme database is accessed
    firstPage = await list(this.memesListReference, { maxResults: image_num, pageToken: this.memespageToken});
  }

  this.memespageToken = firstPage.nextPageToken;
  console.log('Rawrrrrr ' + this.memespageToken)
  let counter = 0;
  /* 
    getDownloadURL() only retrieves the URL where the image is stored. 
    To actually download and process the image, we make a separate request, 
    which can be done using XMLHttpRequest.
    XMLHttpRequest is used to fetch the image data as a blob from the download URL. 
    Once the image data is fetched, it is used to create a local URL for the image blob,
    which is then stored in the masonryImages array for display by ngxMasonry.
  */
  firstPage.items.forEach((itemRef: any) => {
    getDownloadURL(itemRef)
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        /*
          The xhr.onload function is a callback function. It's a set of instructions to the xhr 
          object to follow when the image fetching is completed. While waiting for the image 
          to load, your code can continue executing other tasks, and when the image is loaded 
          (the event), the xhr.onload function is called (executed) to process the image data.
          */
        xhr.onload = () => {
          const blob = xhr.response;
          const imageUrl = URL.createObjectURL(blob);
          this.masonryImages.push({ title: itemRef.name, imageUrl: imageUrl, color: this.getRandomColor() });
          console.log('Image added:', { title: itemRef.name, imageUrl: imageUrl });
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        console.error('Error fetching image:', error);
      });
    if (!this.initialLoadComplete) {
      this.initialLoadComplete = Promise.resolve();
      this.promiseState = 'loaded';
    }
  });
  console.log('Images are being fetched and processed');
  console.log(this.masonryImages.length)
}

  async loadGifs(image_num: number) {

    let firstPage;

    if (!this.firsttimegifs && !this.gifspageToken)
      return;
      
    if (this.firsttimegifs == true)
    {
      firstPage = await list(this.gifsListReference, { maxResults: image_num })
      this.firsttimegifs = false;
      console.log("Gifs Folder was accessed first time");
    }
    else {
      firstPage = await list(this.gifsListReference, {maxResults: image_num, pageToken: this.gifspageToken });
      console.log("Gifs Folder was accessed the next time");
    }

    this.gifspageToken = firstPage.nextPageToken;
    console.log(this.gifspageToken);

    firstPage.items.forEach((itemRef: any) => {
      getDownloadURL(itemRef)
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          /*
            The xhr.onload function is a callback function. It's a set of instructions to the xhr 
            object to follow when the image fetching is completed. While waiting for the image 
            to load, your code can continue executing other tasks, and when the image is loaded 
            (the event), the xhr.onload function is called (executed) to process the image data.
            */
          xhr.onload = () => {
            const blob = xhr.response;
            const imageUrl = URL.createObjectURL(blob);
            this.masonryImages.push({ title: itemRef.name, imageUrl: imageUrl, color: this.getRandomColor() });
            console.log('Image added:', { title: itemRef.name, imageUrl: imageUrl });
          };
          xhr.open('GET', url);
          xhr.send();
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
    });
    console.log('Images are being fetched and processed');
    console.log(this.masonryImages.length)
  }

  /*
  1. @HostListener is a decorator in Angular that listens for events on the host element. 
  In this case, it's listening to the scroll event on the window object. The [] indicates 
  that there are no arguments to be passed to the function that handles this event.
  2. scrollPosition gets the current scroll position in the document
  3. windowHeight gets the current window height
  4. documentHeight gets the total height of the entire document, including the part 
  currently out of view.
  5. if statement conditional checks whether the user has scrolled beyond 30% of the 
  document's total height, and also checks whether the app is currently loading images 
  and whether there are fewer than 500 images already loaded. If all these conditions are met, 
  then more images are loaded.
  6. 100 images will be loaded each time, calls to loadImages will not occur concurrently because of isLoading variable
  */
  scrollTimeout: any;
  memeCount = 0;

  onScroll(event: any) {
    const scrollPosition = this.scrollableDiv.nativeElement.scrollTop;
    this.shouldHideContents = scrollPosition > 70;
    this.isScrolled = scrollPosition > 70;
    this.isPaneVisible = window.pageYOffset > 50;

    this.colorDivs.forEach(div => this.checkIfInView(div));
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

    // Load more images when the user scrolls near the bottom of the page
    // Load more images when the user scrolls near the bottom of the page
      if (scrollPosition + windowHeight >= documentHeight * 0.7 && this.promiseState == 'loaded' && !this.isLoading && this.masonryImages.length < 1000) {
        this.isLoading = true;
        this.loadMemes(15).then(() => {
          this.memeCount += 4; // increment memeCount
          this.isLoading = false;
          if (this.memeCount % 4 == 0) { // check if we should load gifs
            this.loadGifs(25).then(() => {
              console.log('Gifs loaded');
            });
          }
        });
      }
    }, 200);
  }

  itemsLoaded() {
    console.log('itemsloaded');
  }

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }
  
  //overall, the checkIfInView function checks whether each colored box is fully on the screen or not and tells it to start or stop the transition accordingly
  checkIfInView(element: ElementRef) {
    const rect = element.nativeElement.getBoundingClientRect();
    const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight && rect.left >= 0 && rect.right <= window.innerWidth;
    if (isInView) {
      this.renderer.addClass(element.nativeElement, 'transition');
    } else {
      this.renderer.removeClass(element.nativeElement, 'transition');
    }
  }

  //Observers job is to watch certain parts of a webpage 
  //(like some colored boxes), and tell you when these 
  //parts come into view or go out of view
  observers: IntersectionObserver[] = [];

  //Whenever a new colored box shows up, I want 
  //to assign an observer to it
  ngAfterViewInit() {
    //this.colorDivs is a reference to a list of all the colored boxes (divs) on your web page.
    //.changes is a special property that's part of Angular's QueryList. It's like an alarm system that goes off whenever there's a change in the list of colored boxes - for example, when a new box is added, or an old one is removed.
    //.subscribe(...) is like saying, "I want to be notified whenever this alarm goes off." In other words, whenever there's a change in the list of colored boxes, it will run the function that's inside the parentheses.
    //comps is the new list of colored boxes after the change. For example, if a new box was added, comps would be the list of all the old boxes plus the new one
    this.colorDivs.changes.subscribe((comps: QueryList<ElementRef>) =>
      comps.forEach(comp => this.observeElement(comp))
    );
  }
  
  //So, overall, this function creates a robot for each colored box on your web page, tells it how to react when the box comes into view or goes out of view, and adds it to a list of all the other robots.
  observeElement(element: ElementRef) {
    const observer = new IntersectionObserver(([entry]) => {
      const isAbove = entry.boundingClientRect.top < 0;
      const isBelow = entry.boundingClientRect.bottom > window.innerHeight;
      const isLeft = entry.boundingClientRect.left < 0;
      const isRight = entry.boundingClientRect.right > window.innerWidth;
      if (entry.isIntersecting) {
        this.renderer.addClass(entry.target, 'fade-out');
      } else if (!entry.isIntersecting && (isAbove || isBelow || isLeft || isRight)) {
        this.renderer.removeClass(entry.target, 'fade-out');
      }
    });
  
    observer.observe(element.nativeElement);
    this.observers.push(observer);
  }

  //The ngOnDestroy function tells all the robots watching the colored boxes to stop when we're done with the webpage.
  ngOnDestroy() {
    this.observers.forEach(obs => obs.disconnect());
  }

  navigateToHome() {
    this.router.navigate(['/home-page']);
  }

  navigateToAboutUs() {
  this.router.navigate(['/about-us']);
  }

  pageReload() {
    window.location.reload();
  }
}