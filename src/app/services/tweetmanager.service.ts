import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TweetManagerService {

  constructor() { }

  async randomizeTweet() {

    let tweetList: string[] = [
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

    let selectedTweet0: string | undefined;
    let selectedTweet1: string | undefined;  

    let randomIndex0 = Math.floor(Math.random() * tweetList.length);
    let randomIndex1;
    do {
      randomIndex1 = Math.floor(Math.random() * tweetList.length);
    } while (randomIndex0 === randomIndex1);    

    selectedTweet0 = tweetList[randomIndex0];
    selectedTweet1 = tweetList[randomIndex1];

    return {
      tweet0: selectedTweet0,
      tweet1: selectedTweet1
    };

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
  }

}