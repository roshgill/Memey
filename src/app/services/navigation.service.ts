import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  // Define a method to reload the page
  pageReload() {
    window.location.reload();
    }
  
  navigateToHome() {
    this.router.navigate(['']);
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