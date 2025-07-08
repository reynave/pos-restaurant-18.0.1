import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxCurrencyDirective } from "ngx-currency";
import { BillTableComponent } from "../bill/bill-table/bill-table.component";
import { KeyNumberComponent } from "../../keypad/key-number/key-number.component";
import { HeaderMenuComponent } from "../../header/header-menu/header-menu.component";
export class Actor {
  constructor(
    public newQty: number,
  ) { }
}
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, NgxCurrencyDirective, BillTableComponent, KeyNumberComponent, HeaderMenuComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myDiv') myDiv!: ElementRef;
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

  paymentIndex: number = -1;
  inputField: string = '';
  discountGroup: any = [];
 paymentGroups : any = [];
  cssClass: string = 'btn btn-sm p-3 bg-warning me-2 mb-2 rounded shadow-sm';
  cssMenu: string = 'btn btn-sm py-3 bg-white me-1 lh-1  rounded shadow-sm';

  showApplyDiscount: boolean = false;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private renderer: Renderer2
  ) { }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'background-color', '#fff');

  }
  ngAfterViewInit(): void {
    console.log("test")
    try {
      this.myDiv.nativeElement.scrollTop = this.myDiv.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err)
    }
  }


  ngOnInit() {
    this.renderer.setStyle(document.body, 'background-color', 'var(--bg-color-primary-1)');

    this.id = this.activeRouter.snapshot.queryParams['id'];
    this.modalService.dismissAll();
    this.httpCart();
    this.httpPaymentType();
    this.httpPaid();

  }
  back() {
    history.back();
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
        dailyCheckId: this.configService.getDailyCheck() ?? ''
      }
    }).subscribe(
      data => {
        this.data = data['data'];
        this.discountGroup = data['data']['discountGroup'];
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
    const url = environment.api + "payment/paymentGroup";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.paymentGroups = data['items']
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
        this.modalService.dismissAll();
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


  updateRow(x: any) {
    console.log(x);
    const body = {
      item: x
    }
    this.http.post<any>(environment.api + "payment/updateRow", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  handleData(data: string) {
    let value = '';
    if (this.inputField == 'paid') {
      value = this.paid[this.paymentIndex].paid;
    }
    else if (this.inputField == 'tips') {
      value = this.paid[this.paymentIndex].tips;
    }

    value = value.toString()
    if (data == 'b') {
      value = value.slice(0, -1);
    } else {
      value = value + data;
    }


    if (this.inputField == 'paid') {
      this.paid[this.paymentIndex].paid = value;
    }
    else if (this.inputField == 'tips') {
      this.paid[this.paymentIndex].tips = value;
    }
  }

  paymentActive(index: number, inputField: string) {
    this.paymentIndex = index;
    this.inputField = inputField;
    console.log(index, inputField)
  }

  clearCurrentValue() {
    if (this.inputField == 'paid') {
      this.paid[this.paymentIndex].paid = 0;
    }
    else if (this.inputField == 'tips') {
      this.paid[this.paymentIndex].tips = 0;
    }
  }
  paymentGroup : any = {}
  paymentypes : any = [];
  open(content :any, paymentGroup : any){
    this.paymentGroup = paymentGroup;
    this.modalService.open(content, {size:'lg'});

 
    const url = environment.api + "payment/paymentType";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params : {
        paymentGroupId : paymentGroup.id
      }
    }).subscribe(
      data => {
        this.paymentypes = data['items']
      },
      error => {
        console.log(error);
      }
    )

  }
}
