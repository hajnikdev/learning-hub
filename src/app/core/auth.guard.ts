import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // undefined = still loading; null = not logged in
  const user = authService.currentUser();

  if (user === undefined) {
    // Auth state not yet resolved – allow through; guard will re-run on navigation
    return true;
  }

  if (user !== null) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
