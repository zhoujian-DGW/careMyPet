import { TestBed } from '@angular/core/testing';

import { PetserviceService } from './petservice.service';

describe('PetserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PetserviceService = TestBed.get(PetserviceService);
    expect(service).toBeTruthy();
  });
});
