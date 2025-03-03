import { inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly request = inject(REQUEST);
  private readonly storageKey = 'darkMode';
  private readonly darkTheme = 'app-dark';

  isDarkMode$ = new BehaviorSubject<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize from existing DOM class
      const initialMode = document.querySelector('html')?.classList.contains(this.darkTheme) ?? false;
      this.isDarkMode$.next(initialMode);

      this.isDarkMode$
        .pipe(distinctUntilChanged())
        .subscribe(newMode => this.storePreference(newMode));
    }
    if (isPlatformServer(this.platformId) && this.request) {
      // Initialize from cookie
      const cookies = this.request.headers.get('cookie')?.split('; ');
      const darkMode = cookies?.find(c => c.startsWith(`${this.storageKey}=true`));

      this.isDarkMode$.next(darkMode !== undefined);
    }
  }

  toggleTheme() {
    this.isDarkMode$.next(!this.isDarkMode$.getValue());
  }

  private storePreference(newMode: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, String(newMode));
      document.querySelector('html')?.classList.toggle(this.darkTheme, newMode);
      document.cookie = `${this.storageKey}=${newMode}; path=/; max-age=31536000;`;
    }
  }
}
