import { TestBed } from '@angular/core/testing';

import { FirebaseConfigurationService } from '../../services/firebaseconfiguration.service';

describe('FirebaseconfigurationService', () => {
  let service: FirebaseConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
