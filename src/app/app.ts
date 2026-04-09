import { Component, PLATFORM_ID, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './core/auth.service';
import { LoaderComponent } from './shared/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private redirectedAfterRefresh = false;

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId) || this.redirectedAfterRefresh) {
        return;
      }

      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const navigationType = navigationEntries[0]?.type;
      const isRefresh = navigationType === 'reload';

      const user = this.authService.currentUser();
      if (isRefresh && user && this.router.url !== '/') {
        this.redirectedAfterRefresh = true;
        void this.router.navigateByUrl('/');
      }
    });
  }
}
