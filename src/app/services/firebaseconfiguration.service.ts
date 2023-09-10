import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseConfigurationService {

  firebaseConfig: any;
  
  constructor() {
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
  }

  // Initialize Firebase Account
  configureFirebase(memesParams: any) {
  const app = initializeApp(this.firebaseConfig);
  memesParams.storage = getStorage(app);
  }

}