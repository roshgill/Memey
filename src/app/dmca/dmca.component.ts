import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dmca',
  templateUrl: './dmca.component.html',
  styleUrls: ['./dmca.component.css']
})
export class DmcaComponent {

  constructor(private router: Router) {
  }
  
  navigateToHome() {
    this.router.navigate(['']);
  }
}
