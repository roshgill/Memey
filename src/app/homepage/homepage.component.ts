import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, ElementRef, HostListener, ViewChildren, QueryList, Directive } from '@angular/core';
import { NgxMasonryOptions, NgxMasonryComponent } from 'ngx-masonry';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';

export interface MemeCard {
  name: string;
  age: number;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  memeImages: { title: string, imageUrl: string, liked: boolean }[] = [];  
  memesListReference: any; // Add memesListReference as a class property
  initialLoadComplete: Promise<void> | undefined;
  promiseState = 'pending';
  firsttimememes = true;
  isLoading = false;
  isDisabled = true;

  @ViewChild('scrollableDiv', {static: true}) scrollableDiv!: ElementRef;
  memespageToken: string | undefined;


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
    //Tester
    console.log('List reference:', this.memesListReference); 

    this.loadInitialImages();
  }

  async loadInitialImages() {
    const memeBatchSize = 10;
  
    for (let i = 0; i < 5; i++) { // Load 40 memes and 10 gifs in total
      await this.loadMemes(memeBatchSize);
    }
  }

  async loadMemes(image_num: number) {
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
            this.memeImages.push({ title: itemRef.name, imageUrl: imageUrl, liked: false });
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
    console.log(this.memeImages.length)
  }

  onScrollDown() {
    if (this.promiseState == 'loaded' && !this.isLoading && this.memeImages.length < 1000) {
      this.isLoading = true;
      this.loadMemes(30).then(() => {
        this.isLoading = false;
      });
    }
  }

  toggleIcons() {
    this.isDisabled = !this.isDisabled;
  }

  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
    }

  navigateToDungeon() {
    this.router.navigate(['/cdk-scrolling']);
  }
  
  pageReload() {
      window.location.reload();
    }
}
