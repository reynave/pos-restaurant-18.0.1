import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor(private configService: ConfigService) {
    this.socket = io(this.configService.getServerUrl()); // URL server
  }

  // Emit event ke server
  emit(event: string, data?: any): void {
    this.socket.emit(event, data);
  }

  // Listen event dari server
  listen<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.socket.on(event, (data: T) => {
        subscriber.next(data);
      });
    });
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
