import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class UserLoggerService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }

  logAction(action: string) {
    
    const logData = {
      timestamp: new Date(),
      action,
      userId: this.configService.getTokenJson()['name'] + "(" + this.configService.getConfigJson()['id'] + ")", // opsional, bisa dari auth
      url: window.location.href
    };

    this.http.post<any>(environment.api + 'log', logData).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }
}
