// Angular import
import { Component } from '@angular/core';

// App-specific imports
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-dmca',
  templateUrl: './dmca.component.html',
  styleUrls: ['./dmca.component.css']
})

export class DmcaComponent {

  constructor(public navigationService: NavigationService) {
  }
}