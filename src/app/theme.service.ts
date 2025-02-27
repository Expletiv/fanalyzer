import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly storageKey = 'darkMode';
  private readonly darkTheme = 'app-dark';

  isDarkMode$ = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize from existing DOM class (SSR-compatible)
      this.isDarkMode$.next(document.querySelector('html')?.classList.contains(this.darkTheme) ?? false);
    }
  }

  toggleTheme() {
    const newMode = !this.isDarkMode$.value;
    this.isDarkMode$.next(newMode);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, String(newMode));
      document.querySelector('html')?.classList.toggle(this.darkTheme, newMode);
    }
  }
}
