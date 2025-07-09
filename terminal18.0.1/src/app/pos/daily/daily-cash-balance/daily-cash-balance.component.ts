import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxCurrencyDirective } from 'ngx-currency';
import { HeaderMenuComponent } from "../../../header/header-menu/header-menu.component";
import { UserLoggerService } from '../../../service/user-logger.service';

@Component({
  selector: 'app-daily-cash-balance',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule, NgxCurrencyDirective, HeaderMenuComponent],
  templateUrl: './daily-cash-balance.component.html',
  styleUrl: './daily-cash-balance.component.css'
})
export class DailyCashBalanceComponent implements OnInit {
  error: string = '';
  loading: boolean = false;
  items: any = [];
  cashIn: string = '0';
  addFunction: number = 1;
  checkCashType: any = [];
  total: any = {};
  cssMenu: string = "btn btn-lg btn outl";
  currencyOption: any = { prefix: '', thousands: ',', decimal: '.', precision: 0, }
  constructor(
    private config: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    public logService: UserLoggerService
  ) { }

  ngOnInit(): void {
    this.httpGet();
    this.httpGetCashType();
  }

  httpGet() {
    this.modalService.dismissAll();
    let id = this.config.getDailyCheck() ?? '';
    this.http.get<any>(environment.api + "daily/cashBalance", {
      headers: this.config.headers(),
      params: {
        id: id,
      }
    }).subscribe(
      data => {
        this.items = data['items'];
        this.total = data['total'][0];
        console.log(data);
      },
      error => {
        console.log(error);
        this.logService.logAction('ERROR httpGet ' + environment.api + "daily/cashBalance ");
      }
    )
  }
  httpGetCashType() {
    this.http.get<any>(environment.api + "daily/checkCashType", {
      headers: this.config.headers(),
    }).subscribe(
      data => {
        this.checkCashType = data['items']
        console.log(data);
      },
      error => {
        console.log(error);
        this.logService.logAction('ERROR httpGetCashType ' + environment.api + "daily/checkCashType ");
      }
    )
  }


  addValueCashIn(x: any) {

    let cashIn = parseInt(this.cashIn) + (parseInt(x.value) * this.addFunction);

    if (cashIn < 0) cashIn = 0;

    this.cashIn = cashIn.toString();
    console.log(this.cashIn)
  }
  addCashIn() {
    const tempCash = this.cashIn;
    const body = {
      cashIn: this.cashIn,
      dailyCheckId: this.config.getDailyCheck() ?? ''
    }
    this.http.post<any>(environment.api + "daily/addCashIn", body, {
      headers: this.config.headers(),
    }).subscribe(
      data => {
        this.cashIn = '0';
        this.modalService.dismissAll();
        this.httpGet(); 
        this.logService.logAction('addCashIn ' + tempCash + " dailyCheckId : " + (this.config.getDailyCheck() ?? ''));
      },
      error => {
        console.log(error);
        this.logService.logAction('ERROR addCashIn');
      }
    )
  }
  open(content: any) {
    this.modalService.open(content);
  }

}
