// Importing required modules
import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

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
          this.el.nativeElement.style.backgroundColor = '#1645F5';
          break;
        case 'nav':
          //this.el.nativeElement.style.backgroundColor = 'F0F14E';
          break;
        case 'nav-rounded-box':
          this.el.nativeElement.style.backgroundColor = '#ED3833';
          break;
        case 'navi-button':
          this.el.nativeElement.style.backgroundColor = '#ED3833';
          break;
      }
    }
  }
}
