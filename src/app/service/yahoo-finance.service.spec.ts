import { TestBed } from '@angular/core/testing';

import { YahooFinanceService } from './yahoo-finance.service';
import { provideHttpClient } from '@angular/common/http';

describe('YahooFinanceService', () => {
  let service: YahooFinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(YahooFinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
