// Angular and Firebase imports
import { Component, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { collection, addDoc } from "firebase/firestore"; 

// AOS import
import * as aos from 'aos';

// App-specific imports
import { NavigationService } from 'src/app/services/navigation.service';
import { FirebaseConfigurationService } from 'src/app/services/firebaseconfiguration.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})

export class AboutUsComponent implements AfterViewInit {

  // 2-way binding between userModel and form input field
  public userModel = { 
    primaryAddress: '',
  };

  public app: any;
  private db: any;

  constructor(
    public navigationService: NavigationService, 
    public firebaseConfigurationService: FirebaseConfigurationService
  ) {
    this.app = this.firebaseConfigurationService.configureFirebase();
    this.db = this.firebaseConfigurationService.getFirestoreDatabase(this.app);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      aos.init();
    }, 300);
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
}