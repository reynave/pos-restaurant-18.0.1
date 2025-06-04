import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxCurrencyDirective } from "ngx-currency";
import { BillTableComponent } from "../bill/bill-table/bill-table.component";
export class Actor {
  constructor(
    public newQty: number,
  ) { }
}
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, NgxCurrencyDirective, BillTableComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  @ViewChild('myModal', { static: true }) myModal: any;
  loading: boolean = false;
  items: any = [{
    menu: []
  }];
  item: any = [];
  paymentType: any = [];
  cart: any = [];
  id: string = '';
  totalAmount: number = 0;
  totalItem: number = 0;
  api: string = environment.api;
  htmlBill: any = '';
  isChecked: boolean = false;
  paid: any = [];
  paided: any = [];
  data: any = [];
  bill: any = [];
  grandTotal: number = 0;
  closePaymentAmount: number = 1;
  unpaid: number = 0;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) { }


  ngOnInit() {
    this.id = this.activeRouter.snapshot.queryParams['id'],
    this.modalService.dismissAll();
    this.httpCart();
    this.httpPaymentType();
    this.httpPaid();

  }

  httpPaid() {
    this.loading = true;
    const url = environment.api + "payment/paid";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
      }
    }).subscribe(
      data => {
        this.paid = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }

  httpCart() {
    this.loading = true;
    const url = environment.api + "payment/cart";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
        dailyCheckId : this.configService.getDailyCheck() ?? ''
      }
    }).subscribe(
      data => {
        this.data = data['data'];
        this.closePaymentAmount = data['data']['closePaymentAmount'];
        this.unpaid = data['data']['unpaid']
        if (data['closePayment'] == 1) {
          this.openModal();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  httpPaymentType() {
    this.loading = true;
    const url = environment.api + "payment/paymentType";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.paymentType = data['items']
      },
      error => {
        console.log(error);
      }
    )
  }

  httpBill() {
    this.loading = true;
    const url = environment.api + "bill/printing";
    this.http.get(url, {
      responseType: 'text' as const,
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
      }
    }).subscribe(
      (data: string) => {
        this.htmlBill = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  reload() {
    this.httpCart();
  }

  addPayment(payment: any) {
    this.loading = true;
    const body = {
      cartId: this.id,
      payment: payment,
      unpaid: this.unpaid,
    }
    console.log(body)
    this.http.post<any>(environment.api + "payment/addPayment", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpPaid();
        this.httpCart()
      },
      error => {
        console.log(error);
      }
    )
  }

  deletePaid(x: any) {
    let allowDelete = true;
    if (x.submit == 1) {
      if (confirm("DELETE THIS PAYMENT?")) {
        allowDelete = true;
      } else {
        allowDelete = false;
      }
    }

    if (allowDelete == true) {


      this.loading = true;
      const body = {
        cartId: this.id,
        paid: x,
      }
      console.log(body)
      this.http.post<any>(environment.api + "payment/deletePayment", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.httpPaid();
          this.httpCart();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  addPaid() {
    this.loading = true;
    const body = {
      cartId: this.id,
      paid: this.paid,
      totalAmount: this.grandTotal,
    }
    console.log(body)
    this.http.post<any>(environment.api + "payment/addPaid", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpCart();
        this.httpPaid();
      },
      error => {
        console.log(error);
      }
    )
  }

  openModal() {
    this.modalService.open(this.myModal).result.then(
      (result) => {
        console.log("result");
        this.router.navigate(['tables']);
      },
      (reason) => {
        console.log("reason");
        this.router.navigate(['tables']);
      },
    );
  }
}
