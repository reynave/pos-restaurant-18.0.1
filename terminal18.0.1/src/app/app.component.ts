import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SocketService } from './service/socket.service';
import { ConfigService } from './service/config.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent implements OnInit {

  constructor(
    public configService: ConfigService,
    private socketService: SocketService,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    console.log(environment.client+'')
    this.httpCheckKey();
    this.socketService.listen<string>('reload').subscribe((msg) => {
      const data = JSON.parse(msg);
      console.log('AppComponent', data);
      if (localStorage.getItem('pos3.terminal.mitralink') == data['terminalId']) {
        if (localStorage.getItem('pos3.address.mitralink') != data['address']) {
          this.configService.removeTerminalId().subscribe(
            data => {
              this.router.navigate(['terminalRelogin'])
            },
            error => {
              console.log('Error Token')
            }
          )
        }
      }
    });
  }

  httpCheckKey() {
    if (localStorage.getItem("pos3.terminal.mitralink")) {
      console.log("cek Key Lisence dublicated");
      const url = environment.api + "login/checkTerminal";
      this.http.get<any>(url, {
        params: {
          address: localStorage.getItem("pos3.address.mitralink") ?? '',
          terminalId: localStorage.getItem("pos3.terminal.mitralink") ?? '',
        }
      }).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  ngAfterViewInit() {

    var self = this;
    setInterval(function () {
      self.httpCheckKey();
    }, 1000 * 60 * 60);
  }


}
