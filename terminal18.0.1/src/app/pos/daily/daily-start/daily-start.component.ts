import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserLoggerService } from '../../../service/user-logger.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-daily-start',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './daily-start.component.html',
  styleUrl: './daily-start.component.css'
})
export class DailyStartComponent implements OnInit {
  error: string = '';
  loading: boolean = false;
  ver: string = environment.ver;
  outletSelect: any = [];
  employeeSelect: any = [];
  dailyAccess : string = '';
  constructor(
    private configService: ConfigService,
    private router: Router,
    private http: HttpClient, 
    public offcanvasService: NgbOffcanvas,
    public logService: UserLoggerService
  ) { }

  ngOnInit() {
    this.dailyAccess = this.configService.getTokenJson()['dailyAccess'];
    console.log(this.configService.getTokenJson()['dailyAccess'])
    if (this.configService.getTokenJson()['dailyAccess'] != 1) {
      this.router.navigate(['setting']);
      console.log("ERROR")
    }
  }

  onStart() {
    const configData = this.configService.getConfigJson();
    this.error = '';
    this.loading = true;
    const url = environment.api + "daily/start";
    const body = {
      outletId: configData['outlet']['id'],
    }
    console.log(body)
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        localStorage.setItem("pos3.dailyCheck.mitralink", data['insertId']);
        this.router.navigate(['tables'])
      },
      error => {
        console.log(error);
        this.error = error['error']['message'];
      }
    )

  }

  logOff() {
    this.logService.logAction('Sign Off')
    this.offcanvasService.dismiss();
    this.configService.removeToken().subscribe(
      () => {
        this.router.navigate(['login']);
      }
    )
  }
}
