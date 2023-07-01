import { TestBed } from '@angular/core/testing';

import { KuscheService } from './kusche.service';

describe('KuscheService', () => {
  let service: KuscheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KuscheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
