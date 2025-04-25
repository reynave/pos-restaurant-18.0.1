import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private tokenKey: string = "admin.tokenKey.mitralink";
  private configJson: string = "admin.config.mitralink";
  
  //private jtiKey: string = "jti.openAkunting.com";

  constructor(
    private router : Router
  ) { } 
  checkToken(){
    console.log(this.tokenKey, localStorage.getItem(this.tokenKey) );
    if( localStorage.getItem(this.tokenKey) != null  ){
      return true;
    }else{
      return false;
    }
  }

  setToken(data: any): Observable<boolean> {
    try {
      localStorage.setItem(this.tokenKey, "testDev2025");
      localStorage.setItem(this.configJson,"{error:false}");

      return of(true); // Mengembalikan Observable yang mengirimkan nilai boolean true
    } catch (error) {
      return of(false); // Mengembalikan Observable yang mengirimkan nilai boolean false jika terjadi kesalahan
    }
  }

  removeToken(): Observable<boolean> {
    try {
      console.log("removeToken()",this.tokenKey);
      localStorage.removeItem(this.tokenKey);
      return of(true); // Mengembalikan Observable yang mengirimkan nilai boolean true
    } catch (error) {
      return of(false); // Mengembalikan Observable yang mengirimkan nilai boolean false jika terjadi kesalahan
    }
  }

  headers() { 
    const token : any = localStorage.getItem(this.tokenKey);
    return  new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': token ,
    });
  }
}
