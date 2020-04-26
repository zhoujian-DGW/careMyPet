import { TestBed } from '@angular/core/testing';

import { JPushService } from './jpush.service';

describe('JPushService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JPushService = TestBed.get(JPushService);
    expect(service).toBeTruthy();
  });
});
