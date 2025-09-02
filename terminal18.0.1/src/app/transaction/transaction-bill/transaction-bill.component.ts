import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxCurrencyDirective } from "ngx-currency";

@Component({
  selector: 'app-transaction-bill',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, NgxCurrencyDirective ],
 
  templateUrl: './transaction-bill.component.html',
  styleUrl: './transaction-bill.component.css'
})
export class TransactionBillComponent implements  OnInit {
   @ViewChild('myModal', { static: true }) myModal: any;
  loading: boolean = false;
  items: any = [{
    menu: []
  }];
  item: any = [];
  paymentType  : any = [];
  cart: any = [];
  id: string = '';
  totalAmount: number = 0;
  totalItem : number = 0;
  api: string = '';
  htmlBill: any = '';
  isChecked: boolean = false;  
  paid : any = [];
  paided : any = [];
  totalCopy : number = 0;
  bill : any = [];
  grandTotal : number = 0;
  closePaymentAmount : number = 1;
  historyCopy : any = [];
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) { }


  ngOnInit() {
    this.api = this.configService.getApiUrl();
    this.id = this.activeRouter.snapshot.queryParams['id'],
    this.modalService.dismissAll();
    this.httpCart(); 
    this.httpCopy(); 
      
  }
 
  back(){
    history.back();
  }

  httpCart() {
    this.loading = true;
    const url = this.api + "payment/cart";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
      }
    }).subscribe(
      data => {
        this.cart = data['data']['orderItems'];
        this.totalAmount = data['data']['totalAmount'];
        this.totalItem = data['data']['totalItem'];
        this.bill = data['data']['bill'];
        this.paided = data['data']['paided']; 
        this.grandTotal = data['data']['grandTotal'];
        this.closePaymentAmount = data['data']['closePaymentAmount']; 
      },
      error => {
        console.log(error);
      }
    )
  }
   httpCopy() {
    this.loading = true;
    const url = this.api + "transaction/getCopyBill";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
      }
    }).subscribe(
      data => {
       console.log(data);
       this.totalCopy = data['copy'][0]['total'];
      this.historyCopy = data['items'];
       
      },
      error => {
        console.log(error);
      }
    )
  }

  copyBill(){
    this.loading = true;
    const url = this.api + "transaction/addCopyBill";
    const body = {
      id: this.id,
    }
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
      
    }).subscribe(
      data => {
       console.log(data);
      this.httpCopy()
      },
      error => {
        console.log(error);
      }
    )
  }
  
 
}

