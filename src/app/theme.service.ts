import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Make darkTheme a BehaviorSubject, initially set it to false.
  private darkTheme = new BehaviorSubject<boolean>(false);

  constructor() {
    // Check for a saved preference in local storage on startup
    if (localStorage.getItem('darkTheme')) {
      // Retrieves the user's dark theme preference from local storage
      this.darkTheme.next(JSON.parse(localStorage.getItem('darkTheme')!));
    }
  }

  getDarkTheme(): BehaviorSubject<boolean> {
    return this.darkTheme;
  }

  // This function will set darkTheme to true
  enableDarkTheme() {
    this.darkTheme.next(true);
    localStorage.setItem('darkTheme', 'true');
  }

  // This function will set darkTheme to false
  enableColorTheme() {
    this.darkTheme.next(false);
    localStorage.setItem('darkTheme', 'false');
  }
}
