// Importing required modules
import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from './theme.service';
import { Subscription } from 'rxjs';

// Decorator to mark it as a directive and define its selector
@Directive({
  selector: '[appTheme]'
})

export class ThemeDirective implements OnInit, OnDestroy {
  // Declare a Subscription to keep track of theme changes
  private darkThemeSubscription!: Subscription;

  // Injecting ElementRef to access host element and ThemeService to get theme state
  constructor(private el: ElementRef, private themeService: ThemeService) { }

  // Angular lifecycle hook that gets called once the directive is initialized
  ngOnInit(): void {
    this.darkThemeSubscription = this.themeService.getDarkTheme().subscribe((darkTheme: boolean) => {
      this.updateTheme(darkTheme);
    });
  }

  // Angular lifecycle hook that gets called once the directive is destroyed
  ngOnDestroy(): void {
    // Unsubscribe from theme state changes when the directive is destroyed to prevent memory leaks
    this.darkThemeSubscription.unsubscribe();
  }

  // Function to update the theme of the element
  updateTheme(darkTheme: boolean): void {
    // Get the class name of the element
    const className = this.el.nativeElement.className;

    if (darkTheme) {
      // Apply dark theme colors
      switch (className) {
        case 'header':
          this.el.nativeElement.style.backgroundColor = '#212529';
          break;
        case 'nav':
          this.el.nativeElement.style.backgroundColor = 'transparent';
          break;
        case 'nav-rounded-box':
          this.el.nativeElement.style.backgroundColor = '#212529';
          break;
        case 'navi-button':
          this.el.nativeElement.style.backgroundColor = '#1645F5';
          break;
      }
    } else {
      // Apply color theme colors
      switch (className) {
        case 'header':
          this.el.nativeElement.style.backgroundColor = 'rgba(255,255,0,0.938)';
          break;
        case 'nav':
          this.el.nativeElement.style.backgroundColor = 'blue';
          break;
        case 'nav-rounded-box':
          this.el.nativeElement.style.backgroundColor = 'red';
          break;
        case 'navi-button':
          this.el.nativeElement.style.backgroundColor = 'transparent';
          break;
      }
    }
  }
}
