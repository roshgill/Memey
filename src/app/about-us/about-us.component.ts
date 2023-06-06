import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as aos from 'aos';
import { Router } from '@angular/router';
import { OnInit, ViewChild, Renderer2, AfterViewInit, ElementRef, HostListener, ViewChildren, QueryList, Directive } from '@angular/core';


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})

export class AboutUsComponent {

  public shouldHideContents = false;
  @ViewChild('scrollableDiv', {static: true}) scrollableDiv!: ElementRef;

  constructor(private router: Router) {}
  
  ngOnInit() {
    aos.init();
  }

  onScroll(event: any) {
    const scrollPosition = this.scrollableDiv.nativeElement.scrollTop;
    this.shouldHideContents = scrollPosition > 20;
  }

  navigateToHome() {
    this.router.navigate(['/cdk-scrolling']);
  }

  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
  }
  
    pageReload() {
      window.location.reload();
  }
}