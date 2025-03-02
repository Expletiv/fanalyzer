import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { YahooFinanceMethod, YahooFinanceParams, YahooFinanceResult } from '../types/yahoo-finance';
import { Observable } from 'rxjs';

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
}
