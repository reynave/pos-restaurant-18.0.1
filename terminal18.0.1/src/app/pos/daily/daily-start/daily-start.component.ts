import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  constructor(
    private config: ConfigService,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    
  }
   
  onStart() {
    const configData = this.config.getConfigJson();
    this.error = '';
    this.loading = true;
    const url = environment.api + "daily/start";
    const body = {
      outletId: configData['outlet']['id'],
    }
    console.log(body)
    this.http.post<any>(url, body,{
      headers : this.config.headers(),
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
}
