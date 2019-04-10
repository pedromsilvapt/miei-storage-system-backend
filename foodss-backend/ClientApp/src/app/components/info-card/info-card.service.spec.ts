import { TestBed } from '@angular/core/testing';

import { InfoCardService } from './info-card.service';

describe('InfoCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoCardService = TestBed.get(InfoCardService);
    expect(service).toBeTruthy();
  });
});
