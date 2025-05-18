import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[];

  const isLoggedIn = auth.isLoggedIn();
  const userRole = auth.getCurrentUser()?.role

  if (isLoggedIn && userRole && expectedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false
  }
};
