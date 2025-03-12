import { TestBed } from '@angular/core/testing';

import { PpClientService } from './pp-client.service';
import { provideHttpClient } from '@angular/common/http';

describe('PpClientService', () => {
  let service: PpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(PpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
