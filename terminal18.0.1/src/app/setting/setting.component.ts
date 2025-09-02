import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderMenuComponent } from "../header/header-menu/header-menu.component";
import { UserLoggerService } from '../service/user-logger.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderMenuComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {
  config: any = []
  printTest: string = `Test`;
  restPrinter: string = '';
  loading: boolean = false;
  terminal : any = [];
    keyLicense : any = {};
  api : string = '';
  constructor(
    public configService: ConfigService,
    public logService: UserLoggerService,
    private http: HttpClient,
  ) { }
  ngOnInit(): void {
     this.api = this.configService.getApiUrl();
    this.config = this.configService.getConfigJson();
    this.httpCheckKey();
  }
  back() {
    history.back();
  }


  onUpdatePrinter() {
    this.logService.logAction('Update Printer')
  }

  onTestPrinting() {
    this.loading = true;
    this.logService.logAction('Test printing ' + this.config['printer']['address'] + ':' + this.config['printer']['port']);

    this.restPrinter = 'Connecting printer...';
    const body = {
      printer : this.config['printer'],
      note: this.printTest
    }
    console.log(body)
    this.http.post<any>(this.api + "printing/test",body, {
      headers: this.configService.headers(), 
    }).subscribe(
      data => {
        console.log(data);
        this.restPrinter = 'Success print';
        this.logService.logAction('Success print');
        this.loading = false;
      },
      error => {
        console.log(error);
        this.restPrinter =  error['error']['detail'];
        this.logService.logAction('ERROR test printing ' + error['error']['detail']);
        this.loading = false;
      }
    )
  }

  httpCheckKey() {
    if (localStorage.getItem("pos3.terminal.mitralink")) {
    
      const url = this.api + "login/checkTerminal";
      this.http.get<any>(url, {
        params: {
          address: localStorage.getItem("pos3.address.mitralink") ?? '',
          terminalId: localStorage.getItem("pos3.terminal.mitralink") ?? '',
        }
      }).subscribe(
        data => {
        
          this.terminal = data;
          this.keyLicense = data['keyLicense']
        },
        error => {
          console.log(error);
        }
      )
    }
  }

}
