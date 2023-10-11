import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meme-generator',
  templateUrl: './meme-generator.component.html',
  styleUrls: ['./meme-generator.component.css']
})
export class MemeGeneratorComponent {

  constructor(private router: Router) {}


  // Define a method to reload the page
  pageReload() {
      window.location.reload();
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
