import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
export class Actor {
  constructor(
    public newQty: number,
  ) { }
}
@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule],
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
  model = new Actor(1);
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
    this.httpBill();

  }


  httpCart() {
    this.loading = true;
    const url = environment.api + "menuItemPos/cart";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
      }
    }).subscribe(
      data => {
        this.cart = data['items'];
        this.totalAmount = data['totalAmount']
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

  open(content: any, x: any, i: number) {
    this.item = x;
    this.modalService.open(content);
  }








}
