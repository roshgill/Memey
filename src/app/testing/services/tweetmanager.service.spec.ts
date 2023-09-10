import { TestBed } from '@angular/core/testing';

import { TweetManagerService } from '../../services/tweetmanager.service';

describe('TweetManagerService', () => {
  let service: TweetManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
