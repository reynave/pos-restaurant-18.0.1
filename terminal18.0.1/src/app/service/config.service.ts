import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private tokenKey: string = "pos3.tokenKey.mitralink";
  private configJson: string = "pos3.config.mitralink";
  private dailyCheck: string = "pos3.dailyCheck.mitralink";

  //private jtiKey: string = "jti.openAkunting.com";

  constructor(
    private router: Router
  ) { }
  checkToken() {
    console.log(this.tokenKey, localStorage.getItem(this.tokenKey));
    if (localStorage.getItem(this.tokenKey) != null) {
      return true;
    } else {
      return false;
    }
  }
  getTokenJson() {
    const data: any = localStorage.getItem(this.tokenKey);
    const obj = JSON.parse(data);
    return obj;
  }
  getConfigJson() {
    const data: any = localStorage.getItem(this.configJson);
    const obj = JSON.parse(data);
    return obj;
  }
  updateConfigJson(data: any) { 
    try {
      localStorage.setItem(this.configJson, JSON.stringify(data));
      return of(true); // Mengembalikan Observable yang mengirimkan nilai boolean true
    } catch (error) {
      return of(false); // Mengembalikan Observable yang mengirimkan nilai boolean false jika terjadi kesalahan
    }
  }

  getDailyCheck() {
    const id = localStorage.getItem(this.dailyCheck);

    return id;
  }

  setToken(data: string, token: string): Observable<boolean> {
    try {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.configJson, data);

      return of(true); // Mengembalikan Observable yang mengirimkan nilai boolean true
    } catch (error) {
      return of(false); // Mengembalikan Observable yang mengirimkan nilai boolean false jika terjadi kesalahan
    }
  }

  removeToken(): Observable<boolean> {
    try {
    
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.configJson);
      localStorage.removeItem(this.dailyCheck);

      return of(true); // Mengembalikan Observable yang mengirimkan nilai boolean true
    } catch (error) {
      return of(false); // Mengembalikan Observable yang mengirimkan nilai boolean false jika terjadi kesalahan
    }
  }

  headers() {
    const token: any = localStorage.getItem(this.tokenKey);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': token,
    });
  }
}
