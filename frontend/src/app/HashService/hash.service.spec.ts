import { TestBed } from '@angular/core/testing';

import { HashService } from './hash.service';

describe('HashServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HashService = TestBed.get(HashService);
    expect(service).toBeTruthy();
  });
});
