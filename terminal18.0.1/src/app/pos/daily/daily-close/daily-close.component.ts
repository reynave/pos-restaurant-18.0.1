import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-daily-close',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './daily-close.component.html',
  styleUrl: './daily-close.component.css'
})
export class DailyCloseComponent implements OnInit {
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

  onClose() {
    // this.router.navigate(['/'])
    const configData = this.config.getConfigJson();
    this.error = '';
    this.loading = true;
    const url = environment.api + "daily/close";
    const body = {
      id: this.config.getDailyCheck(),
    }
    console.log(body)
    this.http.post<any>(url, body, {
      headers: this.config.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.config.removeToken().subscribe(
          () => {
            this.router.navigate(['/']);
          }
        )

      },
      error => {
        console.log(error);
        this.error = error['error']['message'];
      }
    )

  }
}
