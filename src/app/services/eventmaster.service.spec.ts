import { TestBed } from '@angular/core/testing';

import { EventmasterService } from './eventmaster.service';

describe('EventmasterService', () => {
  let service: EventmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
