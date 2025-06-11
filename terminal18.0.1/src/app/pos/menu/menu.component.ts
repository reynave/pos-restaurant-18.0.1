import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderMenuComponent } from "../../header/header-menu/header-menu.component";
import { BillComponent } from '../bill/bill.component';
export class Actor {
  constructor(
    public newQty: number,
  ) { }
}
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, HeaderMenuComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy {


  loading: boolean = false;
  current: number = 0;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [{
    menu: []
  }];
  modifiers: any = [];
  item: any = [];
  cart: any = [];
  cartOrdered: any = [];

  discountGroup: any = [];

  id: string = '';
  totalAmount: number = 0;
  totalAmountOrdered: number = 0;

  api: string = environment.api;

  isChecked: boolean = false;
  model = new Actor(1);

  cssClass: string = 'btn btn-sm p-3 bg-white me-2 mb-2 rounded shadow-sm';
  cssMenu: string = 'btn btn-sm py-3 bg-white me-1 lh-1  rounded shadow-sm';

  showHeader: boolean = true;

  showApplyDiscount: boolean = false;
  showMenu: boolean = false;
  showModifier: boolean = false;

  checkBoxAllModifier: boolean = false;
  modifierDetail: any = [];
  totalCard: number = 0;
  totalCardOrder: number = 0;

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
  backMenu() {
    this.showHeader = true;
    this.showMenu = false;
    this.showModifier = false;
    this.showApplyDiscount = false;

  }

  fnShowModifierDetail(index: number) {
    this.modifierDetail = this.modifiers[index];

  }

  ngOnInit() {


    this.renderer.setStyle(document.body, 'background-color', 'var(--bg-color-primary-1)');

    this.id = this.activeRouter.snapshot.queryParams['id'],
      this.modalService.dismissAll();
    if (this.id == undefined) {
      alert("ERROR");
      this.router.navigate(['tables'])
    } else {
      this.httpMenu();
      this.httpCart();
      this.httpCartOrdered();

      this.httpGetModifier();
    }

  }

  httpMenu() {
    this.loading = true;
    const url = environment.api + "menuItemPos";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        departmentId: 0,
        outletId: this.configService.getConfigJson()['outlet']['id']
      }
    }).subscribe(
      data => {
        this.loading = false;
        this.items = data['items'];
        this.discountGroup = data['discountGroup'];

      },
      error => {
        console.log(error);
      }
    )
  }

  httpGetModifier() {
    this.loading = true;
    const url = environment.api + "menuItemPos/getModifier";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.loading = false;
        this.modifiers = data['items'];

      },
      error => {
        console.log(error);
      }
    )
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
        this.totalCard = data['totalItem'];
        this.totalAmount = data['totalAmount']

      },
      error => {
        console.log(error);
      }
    )
  }

  httpCartOrdered() {
    this.loading = true;
    const url = environment.api + "menuItemPos/cartOrdered";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
      }
    }).subscribe(
      data => {
        this.totalCardOrder = data['totalItem'];
        this.cartOrdered = data['items'];
        this.totalAmountOrdered = data['totalAmount'];
      },
      error => {
        console.log(error);
      }
    )
  }

  fullReload() {
    this.httpMenu();
    this.httpCart();
    this.httpCartOrdered();
    this.httpGetModifier();
  }
  reload() {
    this.httpCart();
    this.httpCartOrdered();
  }

  open(content: any, x: any, i: number) {
    this.item = x;
    this.modalService.open(content);
  }
  
  openComponent(id : string){
    this.modalService.open(BillComponent, {size:'xl'});
    	//const modalRef = this.modalService.open(BillComponent, {size:'lg'});
     // modalRef.componentInstance.id = id;
  }

  back() {
    history.back();
  }
  addToCart(menu: any) {
    if (menu.qty > 0) {
      const body = {
        id: this.activeRouter.snapshot.queryParams['id'],
        menu: menu,
      }
      this.http.post<any>(environment.api + "menuItemPos/addToCart", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          this.reload();
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
        this.reload();
      },
      error => {
        console.log(error);
      }
    )
  }

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

  fnCheckedOrdered(index: number) {

    this.cartOrdered[index].checkBox == 0 ? this.cartOrdered[index].checkBox = 1 : this.cartOrdered[index].checkBox = 0;

    let isVoid = 0;
    for (let i = 0; i < this.cartOrdered.length; i++) {
      if (this.cartOrdered[i]['checkBox'] == 1) {
        isVoid++;
        i = this.cartOrdered.length + 10;
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
      alert("Please check item first!");
    } else {
      if (confirm("Are you sure  void this select items ?")) {
        console.log(this.cart)

        this.loading = true;
        const body = {
          cart: this.cart,
          cartId: this.id,
        }
        const url = environment.api + "menuItemPos/voidItem";
        this.http.post<any>(url, body, {
          headers: this.configService.headers(),
        }).subscribe(
          data => {
            console.log(data);
            this.reload();
          },
          error => {
            console.log(error);
          }
        )
      }
    }
  }

  addToItemModifier(a: any) {
    if (this.isChecked == false) {
      alert("Please check item first!");
    } else {
      this.loading = true;
      const body = {
        cart: this.cart,
        cartId: this.id,
        modifiers: a,
      }
      console.log(body);
      const url = environment.api + "menuItemPos/addToItemModifier";
      this.http.post<any>(url, body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.reload();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  addDiscountGroup(a: any) {
    if (this.isChecked == false) {
      alert("Please check item first!");
    } else {
      this.loading = true;
      const body = {
        cart: this.cart,
        cartOrdered: this.cartOrdered,

        cartId: this.id,
        discountGroup: a,
      }
      console.log(body);
      const url = environment.api + "menuItemPos/addDiscountGroup";
      this.http.post<any>(url, body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.reload();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  sendOrder() {
    this.loading = true;
    const body = {
      cartId: this.id,
    }
    const url = environment.api + "menuItemPos/sendOrder";
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.reload();
      },
      error => {
        console.log(error);
      }
    )
  }

  exitWithoutOrder() {
    if (confirm("Are you sure exit without order?")) {
      const body = {
        cartId: this.id,
      }
      const url = environment.api + "menuItemPos/exitWithoutOrder";
      this.http.post<any>(url, body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.router.navigate(['tables']);
        },
        error => {
          console.log(error);
        }
      )
    }
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
        console.log(data);
        this.router.navigate(['payment'], { queryParams: { id: this.id } });
      },
      error => {
        console.log(error);
      }
    )
  }

  
}
