// Import necessary modules from Angular and Firebase
import { Component, OnInit, ViewChild, Renderer2, ElementRef} from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { Router } from '@angular/router';

// Define the component metadata
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

// Define the HomepageComponent class
export class HomepageComponent {
  // Define properties for the component
  memeImages: { title: string, imageUrl: string }[] = [];  
  memesListReference: any;
  initialLoadComplete: Promise<void> | undefined;
  promiseState = 'pending';
  firsttimememes = true;
  isLoading = false;
  isDisabled = true;
  memespageToken: string | undefined;

  // Define the constructor for the component, which initializes Firebase and loads initial images
  constructor(private renderer: Renderer2, private router: Router) {
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
    const storage = getStorage(app);
    this.memesListReference = ref(storage, 'memes/');

    // Load initial images
    this.loadInitialImages();
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
      // Get the download URL for each item
      getDownloadURL(itemRef)
        .then((url) => {
          // Create a new XMLHttpRequest object
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';

          // Define the onload function for the XMLHttpRequest object
          xhr.onload = () => {
            // Create a blob from the response
            const blob = xhr.response;
            // Create a URL from the blob
            const imageUrl = URL.createObjectURL(blob);
            // Add the image to the memeImages array
            this.memeImages.push({ title: itemRef.name, imageUrl: imageUrl });
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
  onScrollDown() {
    // Check if the promise state is 'loaded', if it's not loading, and if the length of the memeImages array is less than 500
    if (this.promiseState == 'loaded' && !this.isLoading && this.memeImages.length < 500) {
      this.isLoading = true;
      this.loadMemes(30).then(() => {
        this.isLoading = false;
      });
    }
  }

  // Define a method to navigate to the about us page
  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
    }

  // Define a method to navigate to the dungeon page
  navigateToDungeon() {
    this.router.navigate(['/cdk-scrolling']);
  }

  // Define a method to reload the page
  pageReload() {
      window.location.reload();
    }
}
