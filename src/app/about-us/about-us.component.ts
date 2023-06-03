import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as aos from 'aos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})

export class AboutUsComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    aos.init();
  }

  navigateToHome() {
    this.router.navigate(['/cdk-scrolling']);
    }

}