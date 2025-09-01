import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserLoggerService } from '../../../service/user-logger.service';
import { HeaderMenuComponent } from '../../../header/header-menu/header-menu.component';
export class Actor {
  constructor(public newQty: number, public note: string) {}
}
@Component({
  selector: 'app-menu-modifier',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    RouterModule,
    HeaderMenuComponent,
  ],
  templateUrl: './menu-modifier.component.html',
  styleUrl: './menu-modifier.component.css',
})
export class MenuModifierComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  current: number = 0;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [
    {
      menu: [],
    },
  ];
  isChecked: boolean = false;
  item: any = [];
  cart: any = [];
  id: string = '';
  totalAmount: number = 0;
  grandAmount: number = 0;
  api: string = environment.api;
  model = new Actor(1, '');
  hideTaxSc: number = 1;

  cssClass: string = 'btn btn-sm py-3   rounded shadow-sm';
  cssMenu: string = 'btn btn-sm py-3 bg-white me-1 lh-1  rounded shadow-sm';

  modifierDetail: any = [];
  screenWidth: number = window.innerWidth;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private activeRouter: ActivatedRoute,
    public logService: UserLoggerService
  ) {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
  }
  ngOnDestroy(): void {}

  ngOnInit() {
    (this.id = this.activeRouter.snapshot.queryParams['id']),
      this.modalService.dismissAll();
    this.httpGetModifier();
    this.httpCart();
  }
  httpGetModifier() {
    this.loading = true;
    const url = environment.api + 'menuItemPos/getModifier';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          outletId: this.configService.getConfigJson()['outlet']['id'],
        },
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loading = false;
          this.items = data['items'];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  back() {
    history.back();
  }
  fnShowModifierDetail(index: number) {
    this.modifierDetail = this.items[index];
  }
  httpCart() {
    this.loading = true;
    const url = environment.api + 'menuItemPos/cartDetail';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          id: this.activeRouter.snapshot.queryParams['id'],
          menuId: this.activeRouter.snapshot.queryParams['menuId'],
          price: this.activeRouter.snapshot.queryParams['price'],
          sendOrder: this.activeRouter.snapshot.queryParams['sendOrder'],
        },
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.cart = data['orderItems'];
          this.totalAmount = data['totalAmount'];
          this.grandAmount = data['grandAmount'];
        },
        (error) => {
          console.log(error);
        }
      );
  }

  reload() {
    this.httpGetModifier();
    this.httpCart();
  }

  open(content: any) {
    if (this.isChecked == false) {
      alert('Please check first!');
    } else {
      this.modalService.open(content);
    }
  }

  addToCart(menu: any) {
    if (this.isChecked == false) {
      alert('Please check first!');
    } else {
      const body = {
        id: this.activeRouter.snapshot.queryParams['id'],
        menu: menu,
        cart: this.cart,
      };
      console.log(body);
      this.http
        .post<any>(environment.api + 'menuItemPos/addModifier', body, {
          headers: this.configService.headers(),
        })
        .subscribe(
          (data) => {
            console.log(data);
            this.httpCart();
            this.logService.logAction(
              'Add Modifier ' + menu['descl'] + ' @' + menu['price'],
              this.id
            );
          },
          (error) => {
            console.log(error);
            this.logService.logAction(
              'ERROR Add Modifier ' + menu['descl'] + ' @' + menu['price'],
              this.id
            );
          }
        );
    }
  }

  updateQty() {
    const body = {
      model: this.model,
      item: this.item,
      cartId: this.activeRouter.snapshot.queryParams['id'],
    };
    this.http
      .post<any>(environment.api + 'menuItemPos/updateQty', body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.modalService.dismissAll();
          this.model.newQty = 1;
          this.httpCart();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  fnChecked(index: number) {
    this.cart[index].checkBox == 0
      ? (this.cart[index].checkBox = 1)
      : (this.cart[index].checkBox = 0);

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
      alert('Please check first!');
    } else {
      if (confirm('Are you sure void this selected items ?')) {
        console.log(this.cart);

        this.loading = true;
        const body = {
          cart: this.cart,
          cartId: this.id,
        };
        const url = environment.api + 'menuItemPos/voidItemDetail';
        this.http
          .post<any>(url, body, {
            headers: this.configService.headers(),
          })
          .subscribe(
            (data) => {
              console.log(data);
              this.httpCart();
              this.logService.logAction('onVoid item detail', this.id);
            },
            (error) => {
              console.log(error);
              this.logService.logAction('ERROR onVoid item detail', this.id);
            }
          );
      }
    }
  }

  onRemoveModifier() {
    this.loading = true;
    const body = {
      cart: this.cart,
      cartId: this.id,
    };
    const url = environment.api + 'menuItemPos/removeDetailModifier';
    this.http
      .post<any>(url, body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.httpCart();
          this.logService.logAction('Remove Modifier item detail', this.id);
        },
        (error) => {
          console.log(error);
          this.logService.logAction(
            'ERROR Remove Modifier item detail',
            this.id
          );
        }
      );
  }

  takeOutDetail() {
    if (this.isChecked == false) {
      alert('Please check item first!');
    } else {
      let cart: any[] = [];
      this.cart.forEach((el: any) => {
        if (el['checkBox'] == 1) {
          cart.push(el);
        }
      });

      this.loading = true;
      const body = {
        cart: cart,
        cartId: this.id,
      };
      console.log(body);
      const url = environment.api + 'menuItemPos/takeOutDetail';
      this.http
        .post<any>(url, body, {
          headers: this.configService.headers(),
        })
        .subscribe(
          (data) => {
            console.log(data);
            this.reload();
            this.logService.logAction(' take Out Detail', this.id);
          },
          (error) => {
            console.log(error);
            this.logService.logAction('ERROR take Out Detail', this.id);
          }
        );
    }
  }

  addCustomNotesDetail() {
    const items = [];
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i]['checkBox'] == 1 && this.cart[i]['parentId'] == 0) {
        items.push(this.cart[i]);
      }
    }
    const body = {
      cartId: this.activeRouter.snapshot.queryParams['id'],
      model: this.model,
      items: items,
    };
    console.log(body, this.cart);
    this.http
      .post<any>(environment.api + 'menuItemPos/addCustomNotesDetail', body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          this.logService.logAction(
            'Modifier Custom  Notes :' + this.model.note,
            this.id
          );
          console.log(data);
          this.modalService.dismissAll();
          this.model.newQty = 1;
          this.model.note = '';
          this.reload();
        },
        (error) => {
          console.log(error);
          this.logService.logAction('ERROR ADD MEMO', this.id);
        }
      );
  }
}
