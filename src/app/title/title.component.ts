import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent{

  public shouldHideContents = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Toggle the 'hide-contents' CSS class based on the scroll position
    this.shouldHideContents = scrollPosition > 60;
  }
}