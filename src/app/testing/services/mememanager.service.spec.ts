import { TestBed } from '@angular/core/testing';

import { MememanagerService } from '../../services/mememanager.service';

describe('MememanagerService', () => {
  let service: MememanagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MememanagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
