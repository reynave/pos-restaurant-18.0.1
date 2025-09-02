import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLoggerService } from '../../../service/user-logger.service';

@Component({
  selector: 'app-daily-close',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './daily-close.component.html',
  styleUrl: './daily-close.component.css',
})
export class DailyCloseComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  api: string = '';
  error: string = '';
  loading: boolean = false;
  ver: string = environment.ver;
  outletSelect: any = [];
  employeeSelect: any = [];
  constructor(
    private config: ConfigService,
    private router: Router,
    private http: HttpClient,
    public modalService: NgbModal,
    public logService: UserLoggerService
  ) {}

  ngOnInit() {
    this.api = this.config.getApiUrl();
  }
  back() {
    history.back();
  }
  onClose() {
    // this.router.navigate(['/']);
    this.logService.logAction('Daily Close -> YES');
    const configData = this.config.getConfigJson();
    this.error = '';
    this.loading = true;
    const url = this.api + 'daily/close';
    const body = {
      id: this.config.getDailyCheck(),
    };
    console.log(body);
    this.http
      .post<any>(url, body, {
        headers: this.config.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.activeModal.dismiss();
          this.config.removeToken().subscribe(() => {
            this.router.navigate(['/']);
          });
        },
        (error) => {
          console.log(error);
          this.error = error['error']['message'];
        }
      );
  }
}
