import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Client } from '../types/portfolio-performance';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { getIndexedClient } from '../parser/portfolio-parser';

@Injectable({
  providedIn: 'root'
})
export class PpClientService {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'client';
  private readonly clientSubject = new BehaviorSubject<Client | undefined>(undefined);

  readonly client$ = this.clientSubject.asObservable();
  readonly indexedClient$ = this.client$
    .pipe(distinctUntilChanged())
    .pipe(map(client => client ? getIndexedClient(client) : undefined));
  readonly isXmlUploaded$ = this.client$
    .pipe(distinctUntilChanged())
    .pipe(map(client =>
      isPlatformBrowser(this.platformId) && client !== undefined && localStorage.getItem(this.storageKey) !== null));

  constructor() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const client = localStorage.getItem(this.storageKey);
    if (client) {
      try {
        this.clientSubject.next(JSON.parse(client));
      } catch (e) {
        console.error('Error parsing client from local storage', e);
        localStorage.removeItem(this.storageKey);
      }
    }

    this.clientSubject
      .pipe(distinctUntilChanged())
      .subscribe(client => this.storeClient(client));
  }

  setClient(client: Client | undefined) {
    this.clientSubject.next(client);
  }

  private storeClient(client: Client | undefined) {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (client) {
      localStorage.setItem(this.storageKey, JSON.stringify(client));

      return;
    }

    localStorage.removeItem(this.storageKey);
  }
}
