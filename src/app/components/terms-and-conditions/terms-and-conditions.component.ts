import { Component } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';


@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent {

  constructor(public navigationService: NavigationService) {
  }
}