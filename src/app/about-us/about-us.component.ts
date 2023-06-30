// Import necessary libraries, services and directives from Angular and Firebase
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as aos from 'aos';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { collection, addDoc } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";

// Define the Angular component, including its selector, CSS file and HTML template
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})

// Define the class for the Angular component
export class AboutUsComponent implements AfterViewInit {

  // 2-way binding between userModel and form input field
  public userModel = { 
    primaryAddress: '',
  };

  private db: any;

  // Set up the Firebase app and get references to the Firestore emails database
  constructor(private router: Router ) {
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
    this.db = getFirestore(app);
  }

  ngAfterViewInit() {
    aos.init();
  }

  // Sends user email address to Firestore database
  async OnSubmit(usersEmail: NgForm) {
    // If userEmail is a valid email and the input field is not empty
    if (usersEmail.valid && this.userModel.primaryAddress != '')
    {
      // Add userEmail to users Firestore database
      try {
        const userRef = await addDoc(collection(this.db, "users"), {
          email: this.userModel.primaryAddress
        });
        console.log("User email appended successfully");
      } catch (e) {
        console.error("Error appending user email: ", e);
      }
      // Set input field back to empty string (works because of 2-way binding)
      this.userModel.primaryAddress = '';
    }
  }

  navigateToHome() {
    this.router.navigate(['']);
  }
}