import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../service/config.service';

export const dailyStartGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Menggunakan inject untuk mendapatkan instance Router
  const token = localStorage.getItem('pos3.dailyCheck.mitralink'); // Periksa token di localStorage
  const configService = inject(ConfigService);


  if (token) {
    return true; // Jika token ada, izinkan akses
  } else { 
    router.navigate(['/daily/start']); // Jika token tidak ada, arahkan ke halaman login
    
    return false;
  }
};
