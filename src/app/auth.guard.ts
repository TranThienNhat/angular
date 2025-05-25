import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = sessionStorage.getItem('user');

  if (user) {
    const { role } = JSON.parse(user);

    if (role === 'ADMIN') {
      return true;
    }
  } 
  router.navigate(['/admin/login']);
  return false;
};
