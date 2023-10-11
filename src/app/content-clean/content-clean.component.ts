// Angular & Firebase imports
import { Component, ViewChild, Renderer2, ElementRef} from '@angular/core';
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

// App-specific imports
import { FirebaseConfigurationService } from 'src/app/services/firebaseconfiguration.service';
import { LoadMemesParams } from 'src/app/interfaces/load-meme-params';
import { NavigationService } from 'src/app/services/navigation.service';
import { MemeManagerService } from 'src/app/services/mememanager.service';
import { ThemeService } from 'src/app/services/theme.service';

declare var twttr: any;

@Component({
  selector: 'content-clean',
  templateUrl: './content-clean.component.html',
  styleUrls: ['./content-clean.component.css']
})

export class ContentCleanComponent {

  tweetList: string[] = [
    'https://twitter.com/cb_doge/status/1678399673407504386?ref_src=twsrc%5Etfw',
    'https://twitter.com/DeadpoolUpdate/status/1678427696580231168',
    'https://twitter.com/PokemonGoApp/status/1678143240694816768',
    'https://twitter.com/Mlickles/status/1678208813684465667',
    'https://twitter.com/PokemanZ0N6/status/1678468426950483968',
    'https://twitter.com/BillyM2k/status/1678439033641529344',
    'https://twitter.com/MattWallace888/status/1678098475915919360',
    'https://twitter.com/upblissed/status/1678250341417009153',
    'https://twitter.com/upblissed/status/1678135296150347779',
    'https://twitter.com/DankMemesGlobal/status/1246868153683939334',
    'https://twitter.com/DankMemesGlobal/status/1338158985640255493',
    'https://twitter.com/theMemesBot/status/1672283558294196224',
    'https://twitter.com/buitengebieden/status/1678454914484248599',
    'https://twitter.com/Slakonbothsides/status/1678040395580686336',
    'https://twitter.com/barstoolsports/status/1678130723717365762',
    'https://twitter.com/BillyM2k/status/1677737855827988480'
  ];

  //Add all content that is selected to be delted
  public toDelete = new Set<string>();
  public toDeleteNum = this.toDelete.size;

  //User must enter correct password to access component content
  public passwordcorrect = false;
  public password = '';

  // Selected tweets for display
  public selectedTweet0: string | undefined;
  public selectedTweet1: string | undefined;

  // ViewChildren for accessing DOM elements
  @ViewChild('scrollcontainer', { static: true }) scrollcontainer!: ElementRef;
  @ViewChild('trendingContainer', { static: true }) trendingContainer!: ElementRef;
  @ViewChild('tweetContainer0', { static: true }) tweetContainer0!: ElementRef;

  // Parameters related to memes loading
  memesParams: LoadMemesParams = {
    app: undefined,
    firstTimeMemes: true,
    imageNum: 25,
    isLoading: false,
    isDisabled: true,
    initialLoadComplete: undefined,
    memesPageToken: undefined,
    memesListReference: undefined,
    memeImages: [],
    promiseState: 'pending',
    storage: undefined,
  };

  constructor
  ( 
    private renderer2: Renderer2, 
    private firebaseConfigurationService: FirebaseConfigurationService, 
    private themeService: ThemeService, 
    public navigationService: NavigationService,
    private memeManagerService: MemeManagerService, 
  ) {     
      // Initialize app, storage and Firestore reference from Firebase
      this.memesParams.app = this.firebaseConfigurationService.configureFirebase();
      this.memesParams.storage = this.firebaseConfigurationService.accessStorage(this.memesParams.app);
      this.memesParams.memesListReference = this.firebaseConfigurationService.referenceFirebaseDatabase(this.memesParams.storage, 'funny' + '/');
      
      // Load the initial set of images
      memeManagerService.loadInitialImages(this.memesParams);
  }

  ngOnInit() {
    const reloadInterval = 10;
    let reloadIntervalId = setInterval(() => { this.randomizeTweet() }, reloadInterval * 1000);
    
    const checkHeightInterval = setInterval(() => {
    const tweetContainer0Height = this.tweetContainer0.nativeElement.offsetHeight;
      if (tweetContainer0Height !== 0) {
        const topPosition = ((-1) * (tweetContainer0Height + 100 - 7 - 117.8));
        this.renderer2.setStyle(this.trendingContainer.nativeElement, 'top', `${topPosition}px`);
        clearInterval(checkHeightInterval);
      }
    }, 1000); // Check every 100ms
  }

  ngAfterContentInit() {
    this.randomizeTweet();
  }

  // Handle the scroll down event to load more memes
  onScroll(event: any) {
    if (this.memesParams.promiseState == 'loaded' && !this.memesParams.isLoading && this.memesParams.memeImages.length < 500) {
      this.memesParams.isLoading = true;
      this.memeManagerService.loadMemes(this.memesParams).then(() => {
        this.memesParams.isLoading = false;
      });
    }
  }

  // Generates two random tweets from tweetList array
  async randomizeTweet() {
    let randomIndex0 = Math.floor(Math.random() * this.tweetList.length);
    let randomIndex1;
    do {
      randomIndex1 = Math.floor(Math.random() * this.tweetList.length);
    } while (randomIndex0 === randomIndex1);    

    this.selectedTweet0 = this.tweetList[randomIndex0];
    this.selectedTweet1 = this.tweetList[randomIndex1];

    twttr.widgets.load(
      document.getElementById("tweetContainer0"),
      document.getElementById("tweetContainer1")
    );
  }

  // Define a method to handle the meme category selection events
  displayMemesByCategory(category: string) {
    this.memeManagerService.resetData(this.memesParams);
    this.memesParams.memesListReference = this.firebaseConfigurationService.referenceFirebaseDatabase(this.memesParams.storage, category + '/');
    this.memeManagerService.loadInitialImages(this.memesParams)
    this.scrollcontainer.nativeElement.scrollTop = 0;
  }

  enableDarkTheme() {
    this.themeService.enableDarkTheme();
  }

  enableColorTheme() {
    this.themeService.enableColorTheme();
  }

  //Define a method to compare password in firestore to user input
  async comparePassword() {

    const db = getFirestore(this.memesParams.app);

    //Get the password from firestore
    const passwordRef = doc(db, 'filtering-password', 'password');
    const docSnap = await getDoc(passwordRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      //If the password is correct, navigate to the dungeon page
      if (this.password == docSnap.data()[0]) {
        this.passwordcorrect = true;
      }
      //If the password is incorrect, display an error message
      else {
        console.log("Incorrect password");
    }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  //If box is checked, then add the specific content object to the list, else remove it
  boxChecked(event: any, meme: any) {
    if (event.target.checked == true ) {
      console.log("checked");
      this.toDelete.add(meme);
      console.log(this.toDelete)
    }
    else {
      console.log("unchecked");
      this.toDelete.delete(meme);
      console.log(this.toDelete)
    }
    this.toDeleteNum = this.toDelete.size;
  }

  //Access the firestore database, compare hexadecimal values currently stored and the ones to be deleted; remove necessarry images
  async deleteMemes() {
    var firestoreData = new Set<string>();
    var path = this.memesParams.memesListReference.fullPath;
    path = path + '-hexadecimals';
    
    const db = getFirestore(this.memesParams.app);

    const deleteRef = doc(db, 'meme-hexadecimals', path);
    const docSnap = await getDoc(deleteRef);

    if (docSnap.exists()) {
      this.toDelete = new Set(Array.from(this.toDelete).map(value => value.replace('.jpg', '')));
      firestoreData = new Set(docSnap.data()['values']);
      
      // Create a new Set with values not present in toDelete
      console.log(firestoreData);
      console.log(this.toDelete);
      const newFirestoreData = [...firestoreData].filter(x => !this.toDelete.has(x));
      console.log(newFirestoreData);

      // Write the new values back to Firestore
      await updateDoc(deleteRef, {
        values: newFirestoreData
      });

      this.navigationService.pageReload();
    }
    else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }  
}