import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'Memey';

  isMobile: boolean | undefined;
  isTablet: boolean | undefined;
  
  constructor(private deviceService: DeviceDetectorService, private router: Router) { }

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    if (this.isMobile || this.isTablet)
    {
      this.router.navigate(['/not-supported']);
    }
  }
}
