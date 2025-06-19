import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', 
})
export class UserLoggerService {

  constructor(private http: HttpClient) {}

  logAction(action: string) {
    const logData = {
      timestamp: new Date(),
      action,
      userId: 'user123', // opsional, bisa dari auth
      url: window.location.href
    };

    this.http.post<any>('http://localhost:3000/terminal/log', logData).subscribe(
      data => {
         
      },
      error => {
        console.log(error);
      }
    )
  }
}
