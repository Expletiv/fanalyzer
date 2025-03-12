import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { YahooFinanceMethod, YahooFinanceParams, YahooFinanceResult } from '../types/yahoo-finance';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YahooFinanceService {

  private readonly httpClient = inject(HttpClient);

  call<
    TMethod extends YahooFinanceMethod,
    TArgs extends YahooFinanceParams<TMethod>,
    TResult extends Awaited<YahooFinanceResult<TMethod, TArgs>>>
  (method: TMethod, ...args: TArgs): Observable<TResult> {
    return this.httpClient.post<TResult>('api/yahoo-finance', {method, args});
  }

  findSymbolByIsin(isin: string): Observable<string | undefined> {
    const searchResult = this.call('search', isin, {
      quotesCount: 1,
      newsCount: 0,
    }, {validateResult: true});

    return searchResult
      .pipe(
        map(result => {
          const quote = result.quotes[0];

          if (quote?.isYahooFinance) {
            return quote.symbol;
          }

          return undefined;
        }),
        take(1)
      );
  }
}
