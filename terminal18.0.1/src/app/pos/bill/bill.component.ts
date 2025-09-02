import { Component, inject, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbActiveModal,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BillTableComponent } from './bill-table/bill-table.component';

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    RouterModule,
    BillTableComponent,
  ],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css',
})
export class BillComponent implements OnInit {
  @Input() id: any;
  loading: boolean = false;
  items: any = [
    {
      menu: [],
    },
  ];
  item: any = [];
  cart: any = [];
  //id: string = '';
  totalAmount: number = 0;
  api: string = '';
  htmlBill: any = [];
  isChecked: boolean = false;
  paided: any = [];

  totalItem: number = 0;
  bill: any = [];
  grandTotal: number = 0;
  data: any = [];
  closePaymentAmount: number = 1;
  unpaid: number = 0;
  activeModal = inject(NgbActiveModal);
  close: number = -1;
  cartCopyBill: any = [];
  isPrinting: boolean = false;
  printResp: string = '';
  groups: any = [];
  taxSc: any = [];
  subTotal: any = [];
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.api = this.configService.getApiUrl();
    this.httpCart();

    this.getCartCopyBill();
  }

  httpCart() {
    this.loading = true;
    const url = this.api + 'payment/cart';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          id: this.id,
        },
      })
      .subscribe(
        (data) => {
          this.close = data['cart']['close'];
          this.groups = data['groups'];

          // this.groups.forEach((el: any) => {
          //    this.httpBill(el.subgroup);
          //  });
          this.callWithDelay();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async callWithDelay() {
    for (const el of this.groups) {
      await this.httpBill(el.subgroup); // kalau httpBill async
      await this.delay(100); // delay 1 detik
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getCartCopyBill() {
    const url = this.api + 'bill/getCartCopyBill';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          id: this.id,
        },
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.cartCopyBill = data['items'];
        },
        (error) => {
          console.log(error);
        }
      );
  }

  httpBill(subgroup: number) {
    this.loading = true;
    const url = this.api + 'bill/printing';
    this.http
      .get(url, {
        responseType: 'text' as const,
        params: {
          id: this.id,
          subgroup: subgroup,
        },
      })
      .subscribe(
        (data: string) => {
          this.htmlBill.push(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  reload() {
    this.httpCart();
  }

  payment() {
    this.loading = true;
    const body = {
      id: this.id,
    };
    console.log(body);
    this.http
      .post<any>(this.api + 'payment/submit', body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          this.modalService.dismissAll();
          console.log(data);
          history.back();
          setTimeout(() => {
            this.router.navigate(['payment'], { queryParams: { id: this.id } });
          }, 500);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  printNote: string = '';
  printNoteError: boolean = false;
  printLoading: boolean = false;
  fnPrint() {
    this.printResp = '';
    this.isPrinting = true;
    let htmlBill = '';

    this.htmlBill.forEach((element: any) => {
      htmlBill += element;
    });
    const config = this.configService.getConfigJson();
    const printerIp = config.printerIp;
    const printerPort = config.printerPort;
    const body = {
      message: htmlBill,
      printer: {
        address: config.printerIp,
        port: config.printerPort,
      },
    };
 this.printNoteError = false;
    this.printNote  = '';
    this.printLoading = true;
    console.log(body);
    this.printNote = 'Printing, please wait...';
    this.http
      .post(this.api + 'printing/print', body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.printNote = 'Print Success';
          this.printLoading = false;
        },
        (error) => {
          this.printNoteError = true;
          this.printLoading = false;
          console.log(error);
          this.printNote = 'ERROR ' + error.error.detail;
        }
      );
  }

  printCopyBill() {
    const body = {
      id: this.id,
    };
    this.http
      .post<any>(this.api + 'bill/copyBill', body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          this.getCartCopyBill();
          this.fnPrint();
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  splitBill() {
    this.router
      .navigate(['bill/splitBill'], { queryParams: { id: this.id } })
      .then(() => {
        this.activeModal.dismiss();
      });
  }
}
