// Angular & Firebase imports
import { Component, Renderer2, ElementRef, ViewChildren, QueryList } from '@angular/core';

// NGX Masonry Grid import
import { NgxMasonryOptions } from 'ngx-masonry';

// App-specific imports
import { NavigationService } from 'src/app/services/navigation.service';
import { FirebaseConfigurationService } from 'src/app/services/firebaseconfiguration.service';
import { LoadMemesParams } from 'src/app/interfaces/load-meme-params';
import { MemeManagerService } from 'src/app/services/mememanager.service';

@Component({
  selector: 'app-cdk-scrolling',
  styleUrls: ['cdk-scrolling.component.css'],
  templateUrl: 'cdk-scrolling.component.html',
})

export class CdkScrollingComponent {
  
  // Set configuration options for masonry grid layout
  public masonryOptions: NgxMasonryOptions = {
    horizontalOrder: true,
    percentPosition: true,
    gutter: 0,
  };

  // ViewChildren for accessing DOM elements
  @ViewChildren('colorDiv') colorDivs!: QueryList<ElementRef>;

  memesParams: LoadMemesParams = {
    app: undefined,
    firstTimeMemes: true,
    imageNum: 15,
    isLoading: false,
    isDisabled: true,
    initialLoadComplete: undefined,
    memesPageToken: undefined,
    memesListReference: undefined,
    memeImages: [],
    promiseState: 'pending',
    storage: undefined,
  }

  constructor(
    private renderer: Renderer2, 
    public navigationService: NavigationService, 
    public firebaseConfigurationService: FirebaseConfigurationService,
    public memeManagerService: MemeManagerService
  ) {
      this.memesParams.app = firebaseConfigurationService.configureFirebase();
      this.memesParams.storage = firebaseConfigurationService.accessStorage(this.memesParams.app);
  
      this.memesParams.memesListReference = this.firebaseConfigurationService.referenceFirebaseDatabase(this.memesParams.storage, 'funny' + '/');
      this.memeManagerService.loadInitialImages(this.memesParams);
  }

  // Handle scroll down event to load more memes
  onScroll(event: any) {
    if (this.memesParams.promiseState == 'loaded' && !this.memesParams.isLoading && this.memesParams.memeImages.length < 1000) {
      this.memesParams.isLoading = true;
      this.memeManagerService.loadMemes(this.memesParams).then(() => {
        this.memesParams.isLoading = false;
      });
    }
  }

  // After view is initialized, set up Intersection Observer to create color transition effect
  ngAfterViewInit() {
    this.colorDivs.changes.subscribe((comps: QueryList<ElementRef>) => {

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // If div is in viewport, add 'transition' class
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'transition');
          
          // Unobserve the div since the transition class has been added
          //observer.unobserve(entry.target);          
        } 
        // Else, remove 'transition' class
        else {
          this.renderer.removeClass(entry.target, 'transition');
        }
      });
    }, { threshold: 0.1 }); // Configure observer to trigger when at least 10% of div is visible

      // Use Intersection Observer on each div
      comps.forEach(div => observer.observe(div.nativeElement));
    });
  }
}