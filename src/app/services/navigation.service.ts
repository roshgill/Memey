import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  pageReload() {
    window.location.reload();
    }
  
  navigateToHome() {
    this.router.navigate(['']);
    }

  navigateToDungeon() {
    this.router.navigate(['/dungeon']);
    }

  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
    }

  navigateToDMCA() {
    this.router.navigate(['/dmca']);
    }
  
  navigateToTerms() {
    this.router.navigate(['/terms-conditions']);
    }
}