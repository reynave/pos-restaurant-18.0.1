import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Menggunakan inject untuk mendapatkan instance Router
  const token = localStorage.getItem('pos3.login'); // Periksa token di localStorage

  if (token == '1') {
    return true; // Jika token ada, izinkan akses
  } else {
    console.log(" router.navigate(['/']);")
    //router.navigate(['/tables']); // Jika token tidak ada, arahkan ke halaman login
    return false;
  }
};
