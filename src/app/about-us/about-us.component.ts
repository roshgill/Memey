import { Component } from '@angular/core';
import * as aos from 'aos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})

export class AboutUsComponent {

  email = '';

  constructor(private router: Router) {}
  
  ngOnInit() {
    aos.init();
  }

  navigateToHome() {
    this.router.navigate(['/home-page']);
  }

  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
  }
  
  pageReload() {
      window.location.reload();
  }
}