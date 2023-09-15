//  Firebase imports
import { Injectable } from '@angular/core';
import { list, getDownloadURL, getMetadata } from "firebase/storage";

//  App-specific imports
import { LoadMemesParams } from 'src/app/interfaces/load-meme-params';

// Injectable service for managing meme operations
@Injectable({
  providedIn: 'root'
})

export class MemeManagerService {

  constructor() { }

  // Fetches the initial set of memes
  async loadInitialImages(memesParams: LoadMemesParams) {
    await this.loadMemes(memesParams);
  }

  // Load a set of memes based on given parameters
  async loadMemes(memesParams: LoadMemesParams) {
    
    let currentPage;

    // Determine pagination approach based on flags and token
    if (!memesParams.firstTimeMemes && !memesParams.memesPageToken) 
      return;
    if (memesParams.firstTimeMemes == true) {
      currentPage = await list(memesParams.memesListReference, { maxResults: memesParams.imageNum });
      memesParams.firstTimeMemes = false;
    }
    else {
      currentPage = await list(memesParams.memesListReference, { maxResults: memesParams.imageNum, pageToken: memesParams.memesPageToken});
    }

    // Update the pagination token
    memesParams.memesPageToken = currentPage.nextPageToken;

    // Process and fetch URLs for items in the current page
    currentPage.items.forEach((itemRef: any) => {

      // Retrieve the image's download URL and metadata
      getDownloadURL(itemRef)
        .then((url) => {
          // Fetch image blob from URL and extract associated metadata
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';

          // Define the onload function for the XMLHttpRequest object
          xhr.onload = () => {
            const blob = xhr.response;
            const imageUrl = URL.createObjectURL(blob);
            getMetadata(itemRef)
            .then((metadata) => {
              let betaUser = metadata.customMetadata ? metadata.customMetadata['beta-username'] : '';
              memesParams.memeImages.push({ title: itemRef.name, imageUrl: imageUrl, betaUsername: betaUser });
            })            
            .catch((error) => {
              console.error('Error fetching metadata:', error);
            });
          };

          // Open the XMLHttpRequest object with the GET method and the URL
          xhr.open('GET', url);
          xhr.send();
        })
        // Catch any errors that occur during the process
        .catch((error) => {
          console.error('Error fetching image:', error);
        });

      // Update the state of the initial load
      if (!memesParams.initialLoadComplete) {
        memesParams.initialLoadComplete = Promise.resolve();
        memesParams.promiseState = 'loaded';
      }
    });
  }

  // Resets the meme parameters to their initial states
  resetData(memesParams: LoadMemesParams) {
    memesParams.initialLoadComplete = undefined;
    memesParams.firstTimeMemes = true;
    memesParams.memesPageToken = undefined;
    memesParams.memesListReference = undefined;
    memesParams.memeImages = [];  
    memesParams.promiseState = 'pending';
    memesParams.isLoading = false;
    memesParams.isDisabled = true;
  }
}