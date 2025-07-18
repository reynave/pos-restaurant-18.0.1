import { Component, OnInit } from '@angular/core';
import { HeaderMenuComponent } from "../../header/header-menu/header-menu.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../../service/config.service';
import { environment } from '../../../environments/environment';
import { UserLoggerService } from '../../service/user-logger.service';

@Component({
  selector: 'app-user-logs',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, HeaderMenuComponent, NgbDatepickerModule,],

  templateUrl: './user-logs.component.html',
  styleUrl: './user-logs.component.css'
})
export class UserLogsComponent implements OnInit {
  items: any = [];
  date: any = [];
  today : any = new Date();
  loading: boolean = false;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    public logService: UserLoggerService,
  ) { }
  ngOnInit(): void {
    this.date['year'] = this.today.getFullYear();
    this.date['month'] = this.today.getMonth()+1;
    this.date['day'] = this.today.getDate();

  }
  donwload() {
    const date = this.date['year'] + "-" + this.date['month'].toString().padStart(2, '0') + "-" + this.date['day'].toString().padStart(2, '0');

    this.http.get(environment.api + "log/downloadLog", {
      responseType: 'blob',
      headers: this.configService.headers(),
      params: {
        date: date,
      }
    })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'userLog-' + date + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);

         this.logService.logAction('Download CSV ' + a.download);
      }, err => {
        alert('Download failed');
        console.error('Download failed', err);
             this.logService.logAction('ERROR Download CSV ');
      });
  }
  onSearch() {
    this.loading = true;
    const date = this.date['year'] + "-" + this.date['month'].toString().padStart(2, '0') + "-" + this.date['day'].toString().padStart(2, '0');


    this.http.get<any>(environment.api + "log/getLog", {
      headers: this.configService.headers(),
      params: {
        date: date,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.items = data['log'];
        this.loading = false;
        this.logService.logAction('Search log '+date);
      },
      error => {
        console.log(error);
        alert(error['error']['error'])
         this.loading = false;
        this.logService.logAction('ERROR Search log / not found '+date);
      }
    )
  }
}
