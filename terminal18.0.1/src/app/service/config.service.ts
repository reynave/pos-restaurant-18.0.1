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
    const configJson: any = localStorage.getItem(this.configJson);
    const obj = JSON.parse(configJson);
    return obj;
  }


  setToken(data: string, token : string): Observable<boolean> {
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
      console.log("removeToken()", this.tokenKey);
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.configJson);

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
