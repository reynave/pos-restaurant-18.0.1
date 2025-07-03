import { Component } from '@angular/core';
import { KeyNumberComponent } from "../../keypad/key-number/key-number.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../service/config.service';
import { environment } from '../../../environments/environment';
import { JwtVerifyService } from '../../service/jwt-verify.service';
import { SocketService } from '../../service/socket.service';

@Component({
  selector: 'app-terminal-login',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule, KeyNumberComponent],
  templateUrl: './terminal-login.component.html',
  styleUrl: './terminal-login.component.css'
})
export class TerminalLoginComponent {
  terminalId: string = localStorage.getItem('pos3.terminal.mitralink') ?? '';
  loading: boolean = false;
  error: string = '';
  constructor(
    private config: ConfigService,
    private router: Router,
    private http: HttpClient,
    private jwtService: JwtVerifyService,
    private socketService: SocketService,
  ) { }


  handleData(data: any) {
    if (data == 'b') {
      this.terminalId = this.terminalId.slice(0, -1);

    } else {
      this.terminalId = this.terminalId + data;
    }

  }

  onSubmit() {
    const url = environment.api + "login/terminal";
    const body = {
      terminalId: this.terminalId
    }
    this.http.post<any>(url, body).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.error = '';
        if (data['error'] == false) {

          console.log(this.jwtService.verifyToken(data['fileContent']));

          if (this.jwtService.verifyToken(data['fileContent']) == true) {
            localStorage.setItem(this.config.nameOfterminal(), this.terminalId);
            localStorage.setItem(this.config.nameOfterminalAddressId(), data['address']);

            console.log(this.jwtService.decodePayload(data['fileContent']));
  
            this.router.navigate(['login']);

             this.socketService.emit('message-from-client', 'reload'); 
          } else {
            alert("KEY SIGNATURE IS NOT VALID ")
          }

        }

        // CHECK TOKEN

      },
      error => {
        console.log(error);
        this.error = error['error']['message'];
      }
    )
  }
}
