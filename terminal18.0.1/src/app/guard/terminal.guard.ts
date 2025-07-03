import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const terminalGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Menggunakan inject untuk mendapatkan instance Router
  const token = localStorage.getItem('pos3.terminal.mitralink'); // Periksa token di localStorage

  if (token) {
    return true; // Jika token ada, izinkan akses
  } else {
    router.navigate(['/login/terminal']); // Jika token tidak ada, arahkan ke halaman login
    return false;
  }
};