import { inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
      this.isDarkMode$.next(document.querySelector('html')?.classList.contains(this.darkTheme) ?? false);
    }
    if (isPlatformServer(this.platformId) && this.request) {
      // Initialize from cookie
      const cookies = this.request.headers.get('cookie')?.split('; ');
      const darkMode = cookies?.find(c => c.startsWith(`${this.storageKey}=true`));

      this.isDarkMode$.next(darkMode !== undefined);
    }
  }

  toggleTheme() {
    const newMode = !this.isDarkMode$.value;
    this.isDarkMode$.next(newMode);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, String(newMode));
      document.querySelector('html')?.classList.toggle(this.darkTheme, newMode);
      document.cookie = `${this.storageKey}=${newMode}; path=/;`;
    }
  }
}
