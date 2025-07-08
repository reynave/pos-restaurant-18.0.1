import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserLoggerService } from '../../service/user-logger.service';
import { DailyCloseComponent } from '../../pos/daily/daily-close/daily-close.component';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css'
})
export class HeaderMenuComponent implements OnInit, OnDestroy {

  dataHeader: any = {};
  loading: boolean = false;
  terminalId: any = localStorage.getItem("pos3.terminal.mitralink");
  currentTime: Date = new Date();
  private intervalId: any;
  getTokenJson: any = [];
  path: any = '';
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public offcanvasService: NgbOffcanvas,
    private router: Router,
    public modalService: NgbModal,
    private activeRouter: ActivatedRoute,
    public logService: UserLoggerService

  ) { }

  ngOnInit(): void {
    this.httpHeader();
    this.getTokenJson = this.configService.getTokenJson();
    this.path = this.activeRouter.snapshot.routeConfig?.path;
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000); // update setiap 1 detik 
  }

  openEnd(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  back() {
    history.back();
  }
  signOff() {
   
    this.logService.logAction('signOff')
    this.offcanvasService.dismiss();
    this.configService.removeToken().subscribe(
      () => {
        this.router.navigate(['login']);
      }
    )
  }


  dailyClose() {

    this.http.get<any>(environment.api + "daily/checkItems", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);

        if (data['items'].length > 0) {
          alert("Please close " + data['items'].length + " tables!");
          this.logService.logAction('please close ' + data['items'].length + ' tables!')
        } else {
              this.offcanvasService.dismiss();
          this.modalService.open(DailyCloseComponent, { size: 'sm' });
          this.logService.logAction('Daily Close ?')
        }
      },
      error => {
        console.log(error);
      }
    )

  }

  httpHeader() {
    let id = this.configService.getDailyCheck();
    const url = environment.api + "daily/getDailyStart";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: id,
      }
    }).subscribe(
      data => {
        this.loading = false;
        this.dataHeader = data['item'];
      },
      error => {
        console.log(error);
      }
    )
  }
  logOff() {
    this.logService.logAction('logOff')
    this.configService.isLogoff();
    this.offcanvasService.dismiss();
    this.router.navigate(['/']);
  }

}
