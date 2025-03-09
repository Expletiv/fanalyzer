import { TestBed } from '@angular/core/testing';

import { PpClientService } from './pp-client.service';

describe('PpClientService', () => {
  let service: PpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
