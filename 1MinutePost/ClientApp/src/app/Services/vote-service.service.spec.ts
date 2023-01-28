import { TestBed } from '@angular/core/testing';

import { VoteServiceService } from './vote-service.service';

describe('VoteServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoteServiceService = TestBed.get(VoteServiceService);
    expect(service).toBeTruthy();
  });
});
