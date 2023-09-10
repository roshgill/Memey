import { Injectable } from '@angular/core';
import { getStorage, ref, list, getDownloadURL, getMetadata } from "firebase/storage";
import { LoadMemesParams } from '../interfaces/load-meme-params';

@Injectable({
  providedIn: 'root'
})
export class MemeManagerService implements LoadMemesParams {

  constructor() { }

  // Load initial images
  async loadInitialImages(memesParams: LoadMemesParams) {
  
    for (let i = 0; i < 5; i++) {
      await this.loadMemes(memesParams);
    }
  }

  // Load memes into the memeImages array
  async loadMemes(memesParams: LoadMemesParams) {
    
    let firstPage;

    // Check if it's the first time loading memes and if there's a page token
    if (!memesParams.firstTimeMemes && !memesParams.memesPageToken) 
      return;
    if (memesParams.firstTimeMemes == true) {
      firstPage = await list(memesParams.memesListReference, { maxResults: memesParams.imageNum });
      memesParams.firstTimeMemes = false;
    }
    else {
      firstPage = await list(memesParams.memesListReference, { maxResults: memesParams.imageNum, pageToken: memesParams.memesPageToken});
    }

    // Update page token
    memesParams.memesPageToken = firstPage.nextPageToken;

    // Process each item from first page
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

      if (!memesParams.initialLoadComplete) {
        memesParams.initialLoadComplete = Promise.resolve();
        memesParams.promiseState = 'loaded';
      }
    });
  }

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