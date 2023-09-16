import { Injectable } from '@angular/core';

// Injectable service for managing tweet operations
@Injectable({
  providedIn: 'root'
})

export class TweetManagerService {

  constructor() { }

  // Generates two random tweets from the tweetList.
  async randomizeTweet(tweetList: string[]) {
  
    let randomIndex0 = Math.floor(Math.random() * tweetList.length);
    let randomIndex1;
    do {
      randomIndex1 = Math.floor(Math.random() * tweetList.length);
    } while (randomIndex0 === randomIndex1);    
  
    return {
      randomIndex0: randomIndex0,
      randomIndex1: randomIndex1
    };
   }
}

  //****************************************************************************************************
  //   * Note: Following code is trying to dynamically update the tweet containers, but it's not working.
  //
  //   twttr.widgets.load(
  //     document.getElementById("tweetContainer1")
  //   );

  //   // Get the tweet container
  //   let tweetContainer = document.getElementById('tweetContainer1');

  //   // Remove the old blockquote from the tweet container
  //   while (tweetContainer?.firstChild) {
  //     tweetContainer.removeChild(tweetContainer.firstChild);
  //   }

  //   // Create a new blockquote with the new tweet
  //   let blockquote = document.createElement('blockquote');
  //   blockquote.className = 'twitter-tweet';
  //   blockquote.dataset['lang'] = 'en';
  //   blockquote.dataset['theme'] = 'dark';

  //   let a = document.createElement('a');
  //   a.href = selectedTweet1;
  //   blockquote.appendChild(a);

  //   let script = document.createElement('script');
  //   script.async = true;
  //   script.src = 'https://platform.twitter.com/widgets.js';
  //   script.charset = 'utf-8';
  //   blockquote.appendChild(script);

  //   tweetContainer?.appendChild(blockquote);

  //   twttr.widgets.load(
  //     document.getElementById("tweetContainer1")
  //   );
  //*******************************************************************************************************