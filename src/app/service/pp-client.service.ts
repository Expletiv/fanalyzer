import { computed, inject, Injectable, PLATFORM_ID, Signal } from '@angular/core';
import { Client, ClientData, Security } from '../types/portfolio-performance';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  Observable,
  of, shareReplay,
  startWith,
  switchMap
} from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { getIndexedClient, parseClient, parseClientData } from '../parser/portfolio-parser';
import { YahooFinanceService } from './yahoo-finance.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class PpClientService {

  private readonly yahooFinanceService = inject(YahooFinanceService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'client';
  private readonly clientSubject = new BehaviorSubject<Client>({state: 'empty'});

  readonly client$: Observable<Client> = this.clientSubject.asObservable()
    .pipe(
      switchMap(client => this.hydrateSecurities(client)),
      shareReplay({refCount: true, bufferSize: 1}),
    );

  readonly indexedClient$: Observable<Map<number, object>> = this.client$
    .pipe(map(client => client.data ? getIndexedClient(client.data) : new Map()));

  readonly state$ = this.client$
    .pipe(map(({state}) => state));

  readonly state = toSignal(this.state$, {requireSync: true});

  constructor() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        this.clientSubject.next(parseClient(JSON.parse(data)));
      } catch (e) {
        console.error('Error parsing data from local storage', e);
        localStorage.removeItem(this.storageKey);
      }
    }

    this.client$.subscribe(client => this.storeClient(client));
  }

  getClient(): Signal<Client> {
    return toSignal(this.client$, {requireSync: true});
  }

  getData(): Signal<ClientData | undefined>
  getData<T extends keyof ClientData>(field?: T): Signal<ClientData[T] | undefined>
  getData<T extends keyof ClientData>(field?: T): Signal<ClientData | ClientData[T] | undefined> {
    if (field) {
      return toSignal(this.client$.pipe(map(client => client.data?.[field])));
    }

    return toSignal(this.client$.pipe(map(client => client.data)));
  }

  isHydrating(): Signal<boolean> {
    return computed(() => this.state() === 'hydrating');
  }

  isXmlUploaded(): Signal<boolean> {
    return computed(() => this.state() !== 'empty');
  }

  newClient(clientData: any) {
    this.clientSubject.next({data: parseClientData(clientData), state: 'initial'});
  }

  private storeClient(client: Client) {
    if (isPlatformServer(this.platformId) || client.state === 'hydrating') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(client));
  }

  private hydrateSecurities(client: Client): Observable<Client> {
    const data = client.data;

    if (client.state === 'hydrated' || client.state === 'hydrating' || data?.securities === undefined || data.securities.length === 0) {
      return of(client);
    }

    const securities: Observable<Security[]> = forkJoin(data.securities.map((security: Security): Observable<Security> => {
      if (security.tickerSymbol) {
        return of(security);
      }

      return this.yahooFinanceService.findSymbolByIsin(security.isin).pipe(
        map(tickerSymbol => ({...security, tickerSymbol})),
        catchError(() => of(security))
      );
    }));

    return securities.pipe(
      map(securities => ({
        data: {...data, securities},
        state: 'hydrated' as const,
      })),
      startWith({...client, state: 'hydrating' as const}),
    );
  }
}
