import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private tokenKey: string = 'pos3.tokenKey.mitralink';
  private configJson: string = 'pos3.config.mitralink';
  private dailyCheck: string = 'pos3.dailyCheck.mitralink';
  private terminalId: string = 'pos3.terminal.mitralink';
  private terminalAddressId: string = 'pos3.address.mitralink';

  //private jtiKey: string = "jti.openAkunting.com";

  private api: string = 'pos3.env.api';
  private server: string = 'pos3.env.server';

  constructor(private router: Router) {}


  getServerUrl(): string {
    return localStorage.getItem(this.server) || environment.server;
  }
  getApiUrl(): string {
    return localStorage.getItem(this.api) || environment.api;
  }

 


  nameOfterminal() {
    return this.terminalId;
  }
  nameOfterminalAddressId() {
    return this.terminalAddressId;
  }
  checkToken() {
    console.log(this.tokenKey, localStorage.getItem(this.tokenKey));
    if (localStorage.getItem(this.tokenKey) != null) {
      return true;
    } else {
      return false;
    }
  }
  getTokenJson() {
    const token: any = localStorage.getItem(this.tokenKey);
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
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
    const id = localStorage.getItem(this.dailyCheck) ?? '';

    return id;
  }

  setToken(data: string, token: string): Observable<boolean> {
    try {
      localStorage.setItem(this.configJson, data);
      localStorage.setItem(this.tokenKey, token);

      return of(true); // Mengembalikan Observable yang mengirimkan nilai boolean true
    } catch (error) {
      return of(false); // Mengembalikan Observable yang mengirimkan nilai boolean false jika terjadi kesalahan
    }
  }

  removeTerminalId() {
    try {
      localStorage.removeItem('pos3.terminal.mitralink');
      localStorage.removeItem('pos3.address.mitralink');
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
      // localStorage.removeItem('pos3.terminal.mitralink');
      //  localStorage.removeItem('pos3.address.mitralink');

      return of(true); // Mengembalikan Observable yang mengirimkan nilai boolean true
    } catch (error) {
      return of(false); // Mengembalikan Observable yang mengirimkan nilai boolean false jika terjadi kesalahan
    }
  }

  headers() {
    const token: any = localStorage.getItem(this.tokenKey);

    const data = {
      terminalId: localStorage.getItem(this.terminalId) ?? '',
      address: localStorage.getItem(this.terminalAddressId) ?? '',
    };

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Terminal': JSON.stringify(data),
    });
  }

  getLogin() {
    return localStorage.getItem('pos3.login');
  }
  isLogin() {
    localStorage.setItem('pos3.login', '1');
  }
  isLogoff() {
    localStorage.removeItem('pos3.login');
  }
}
