import { Component, inject, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BillTableComponent } from "./bill-table/bill-table.component";
 
@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, BillTableComponent],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit {
  loading: boolean = false;
  items: any = [{
    menu: []
  }];
  item: any = [];
  cart: any = [];
  id: string = '';
  totalAmount: number = 0;
  api: string = environment.api;
  htmlBill: any = '';
  isChecked: boolean = false;
  paided: any = [];

  totalItem: number = 0;
  bill: any = [];
  grandTotal: number = 0;
  data :any = [];
  closePaymentAmount: number = 1;
  unpaid : number = 0;
  activeModal = inject(NgbActiveModal);
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) { }


  ngOnInit() { 
    this.id = this.activeRouter.snapshot.queryParams['id']
    this.httpCart();
    this.httpBill();

  }

  taxSc: any = [];
  subTotal: any = [];
  httpCart() {

    this.loading = true;
    const url = environment.api + "payment/cart";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
      }
    }).subscribe(
      data => {
          this.data = data['data'];
        this.cart = data['data']['cart'];
        this.taxSc = data['data']['taxSc']; 
        this.subTotal = data['data']['subTotal'];
        this.grandTotal = data['data']['grandTotal'];
        this.totalItem = data['data']['totalItem'];  
        this.bill = data['data']['bill'];
        this.paided = data['data']['paided'];
        this.closePaymentAmount = data['data']['closePaymentAmount'];

        this.unpaid = data['data']['unpaid']
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

  payment() {
    this.loading = true;
    const body = {
      id: this.id,
    }
    console.log(body)
    this.http.post<any>(environment.api + "payment/submit", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.modalService.dismissAll();
        console.log(data);
        this.router.navigate(['payment'], { queryParams: { id: this.id } });
      },
      error => {
        console.log(error);
      }
    )
  }



}
