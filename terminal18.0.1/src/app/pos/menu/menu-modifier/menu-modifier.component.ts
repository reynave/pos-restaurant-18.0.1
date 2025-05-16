import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
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
  selector: 'app-menu-modifier',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule],
  templateUrl: './menu-modifier.component.html',
  styleUrl: './menu-modifier.component.css'
})
export class MenuModifierComponent implements OnInit {
  loading: boolean = false;
  current: number = 0;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [{
    menu: []
  }];

  item: any = [];
  cart: any = [];
  id: string = '';
  totalAmount: number = 0;
  api: string = environment.api;
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
    this.httpGetModifier();
    this.httpCart();
  }
  httpGetModifier() {
    this.loading = true;
    const url = environment.api + "menuItemPos/getModifier";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.items = data['items'];

      },
      error => {
        console.log(error);
      }
    )
  }


  httpCart() {
    this.loading = true;
    const url = environment.api + "menuItemPos/cartDetail";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
        menuId: this.activeRouter.snapshot.queryParams['menuId'],
        price: this.activeRouter.snapshot.queryParams['price'],
      }
    }).subscribe(
      data => {
        console.log(data);
        this.cart = data['items'];
        this.totalAmount = data['totalAmount']
      },
      error => {
        console.log(error);
      }
    )
  }

  reload() {
    this.httpGetModifier();
    this.httpCart();
  }

  open(content: any, x: any, i: number) {
    this.item = x;
    this.modalService.open(content);
  }

  addToCart(menu: any) {
    if (this.isChecked == false) {
      alert("Please check first!");
    } else {
      const body = {
        id: this.activeRouter.snapshot.queryParams['id'],
        menu: menu,
        cart: this.cart
      }
      console.log(body)
      this.http.post<any>(environment.api + "menuItemPos/addModifier", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.httpCart();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  updateQty() {
    const body = {
      model: this.model,
      item: this.item,
      cartId: this.activeRouter.snapshot.queryParams['id'],
    }
    this.http.post<any>(environment.api + "menuItemPos/updateQty", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.modalService.dismissAll();
        this.model.newQty = 1;
        this.httpCart();
      },
      error => {
        console.log(error);
      }
    )
  }

  isChecked: boolean = false;
  fnChecked(index: number) {
    this.cart[index].checkBox == 0 ? this.cart[index].checkBox = 1 : this.cart[index].checkBox = 0;

    let isVoid = 0;
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i]['checkBox'] == 1) {
        isVoid++;
        i = this.cart.length + 10;
      }
    }
    if (isVoid == 0) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }
  onVoid() {

    if (this.isChecked == false) {
      alert("Please check first!");
    } else {
      if (confirm("Are you sure void this selected items ?")) {
        console.log(this.cart)

        this.loading = true;
        const body = {
          cart: this.cart,
          cartId: this.id,
        }
        const url = environment.api + "menuItemPos/voidItemDetail";
        this.http.post<any>(url, body, {
          headers: this.configService.headers(),
        }).subscribe(
          data => {
            console.log(data);
            this.httpCart();
          },
          error => {
            console.log(error);
          }
        )
      }
    }
  }

  onRemoveModifier() {
    this.loading = true;
    const body = {
      cart: this.cart,
      cartId: this.id,
    }
    const url = environment.api + "menuItemPos/removeDetailModifier";
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.httpCart();
      },
      error => {
        console.log(error);
      }
    )
  }
}
