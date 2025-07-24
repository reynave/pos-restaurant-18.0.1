import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderMenuComponent } from "../../header/header-menu/header-menu.component";
import { BillComponent } from '../bill/bill.component';
import { KeyNumberComponent } from "../../keypad/key-number/key-number.component";
import { TransferLogComponent } from './transfer-log/transfer-log.component';
import { UserLoggerService } from '../../service/user-logger.service';
import { MergerLogComponent } from './merger-log/merger-log.component';
export class Actor {
  constructor(
    public newQty: number,
    public note: string,
  ) { }
}
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, HeaderMenuComponent, KeyNumberComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('myInput') myInputRef!: ElementRef<HTMLInputElement>;

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
  model = new Actor(1, '');

  cssClass: string = 'btn btn-sm py-3 btn-outi mb-2 rounded shadow-sm';
  cssMenu: string = 'btn btn-sm py-3 bg-white  me-1 lh-1  rounded shadow-sm';
  cssMenuDisable: string = 'btn btn-sm py-3 btn-light me-1 lh-1  rounded shadow-sm';

  showHeader: boolean = true;

  showApplyDiscount: boolean = false;
  showMenu: boolean = false;
  showModifier: boolean = false;

  checkBoxAllModifier: boolean = false;
  modifierDetail: any = [];
  totalCard: number = 0;
  totalCardOrder: number = 0;

  lookUpHeader: string = '';
  menuLookUp: any = [];
  menuLookupId: number = 0;
  menuLookUpParent: any = [];

  tablesMaps: any = [];
  table: any = [];

  checkBoxAll: boolean = false;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private renderer: Renderer2,
    public logService: UserLoggerService
  ) { }
  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'background-color', '#fff');
  }

  fnCheckBoxAll() {
    if (this.checkBoxAll == false) {
      this.checkBoxAll = true;
      this.isChecked = true
    } else {
      this.checkBoxAll = false;
      this.isChecked = false
    }


    this.cartOrdered.forEach((el: any) => {
      el['checkBox'] = this.checkBoxAll;
    });
    this.cart.forEach((el: any) => {
      el['checkBox'] = this.checkBoxAll;
    });
  }

  fnShowModifierDetail(index: number) {
    this.modifierDetail = this.modifiers[index];

  }

  ngOnInit() {
    this.renderer.setStyle(document.body, 'background-color', 'var(--bg-color-primary-1)');

    this.id = this.activeRouter.snapshot.queryParams['id'],
      this.modalService.dismissAll();
    if (this.id == undefined) {
      alert("ERROR, ngOnInit() id == undefined ");
      this.router.navigate(['tables'])
    } else {
      this.httpMenu();
      this.httpCart();
      this.httpCartOrdered();
      this.httpGetModifier();
      this.httpTables();
      this.httpDailyStart();
    }

  }

  lock: boolean = true;
  httpDailyStart() {
    let id = this.configService.getDailyCheck();
    const url = environment.api + "daily/getDailyStart";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: id,
      }
    }).subscribe(
      data => {
        this.loading = false;

        if (data['item']['closeDateWarning'] > 0) {
          this.lock = false;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  httpMenuLookUp(id: number) {
    this.logService.logAction('Menu Lookup ' + id, this.id)
    this.loading = true;
    const url = environment.api + "menuItemPos/menuLookUp";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        parentId: id,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.menuLookUpParent = data['parent']
        this.menuLookUp = data['results'];
        if (data['parent'].length) {
          this.menuLookupId = data['parent'][0]['id'];
        }

        this.httpMenu();
      },
      error => {
        console.log(error);
      }
    )
  }

  btnFinish() {

    this.showHeader = true;
    this.showMenu = false;
    this.showModifier = false;
    this.showApplyDiscount = false;
    this.httpMenuLookUp(0);
  }

  backMenu(menuLookUpParent: any = []) {

    if (menuLookUpParent.length <= 0) {
      this.showHeader = true;
      this.showMenu = false;
      this.showModifier = false;
      this.showApplyDiscount = false;
    } else {
      this.httpMenuLookUp(menuLookUpParent[0]['parentId']);
    }
  }

  httpMenu() {
    this.loading = true;
    const url = environment.api + "menuItemPos";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        menuLookupId: this.menuLookupId,
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
      params: {
        outletId: this.configService.getConfigJson()['outlet']['id']
      }
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
        this.table = data['table'][0];
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
    this.httpTables();
  }

  reload() {
    this.httpMenu();
    this.httpCart();
    this.httpCartOrdered();
  }

  open(content: any, x: any, i: number, size: string = 'sm') {
    this.item = x;
    this.modalService.open(content, { size: size });
  }

  modal(content: any, size: string = 'sm') {
    if (this.isChecked == false) {
      alert("Please check item first!");
    } else {
      const modalRef = this.modalService.open(content, { size: size });
      // Tunggu sampai modal selesai terbuka (after animation)
      setTimeout(() => {
        const inputElement = this.myInputRef?.nativeElement;
        if (inputElement) {
          inputElement.focus();
          inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
        }
      }, 300);
    }
  }

  addCustomNotes() {
    const qty = this.model.newQty;
    const items: any = [];
    this.cart.forEach((row: any) => {
      if (row['checkBox']) {
        items.push({
          menuId: row['menuId'],
          price: row['price']
        });
      }
    });

    const body = {
      model: this.model,
      items: items,
      cartId: this.activeRouter.snapshot.queryParams['id'],
    }
    console.log(body)
    this.http.post<any>(environment.api + "menuItemPos/addCustomNotes", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.logService.logAction('Modifier Custom  Notes :' + this.model.note, this.id);
        console.log(data);
        this.modalService.dismissAll();
        this.model.newQty = 1;
        this.model.note = '';
        this.reload(); 
      },
      error => {
        console.log(error);
        this.logService.logAction('ERROR Add Qty ' + qty + ' ' + this.item['name'], this.id)
      }
    )
  }

  openSm(content: any) {

    this.modalService.open(content, { size: 'sm' });
  }

  openComponent(id: string) {
    //this.modalService.open(BillComponent, {size:'xl'});
    const modalRef = this.modalService.open(BillComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
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
          this.logService.logAction('Add Menu ' + menu['name'] + '(' + menu['id'] + ') @' + menu['price'], this.id)
          this.reload();
        },
        error => {
          console.log(error);
          this.logService.logAction('ERROR Add Menu ' + menu['name'] + '(' + menu['id'] + ') @' + menu['price'], this.id)
        }
      )
    }
  }

  updateQty() {
    const qty = this.model.newQty;
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
        if (data['warning']) {
          this.logService.logAction('WARNING Add Qty ' + qty + ' ' + this.item['name'], this.id)
          alert(data['warning']);
        } else {
          this.logService.logAction('Add Qty ' + qty + ' ' + this.item['name'], this.id)
        }
      },
      error => {
        console.log(error);
        this.logService.logAction('ERROR Add Qty ' + qty + ' ' + this.item['name'], this.id)
      }
    )
  }

  updateCover() {
    const qty = this.model.newQty;
    const body = {
      model: this.model,
      cartId: this.activeRouter.snapshot.queryParams['id'],
    }

    this.http.post<any>(environment.api + "menuItemPos/updateCover", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.table['cover'] = this.model.newQty;
        this.modalService.dismissAll();
      },
      error => {
        alert("ERROR");
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
        this.logService.logAction('Void item ', this.id)
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
            this.logService.logAction('ERROR Void item ', this.id)
          }
        )
      }
    }
  }

  fnCustomNotes() {
    if (this.isChecked == false) {
      alert("Please check item first!");
    } else {

    }
  }

  results : any = [];
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
          this.logService.logAction('Add Modifier ' + a['descs'] + '(' + a['id'] + ') @' + a['price'], this.id)
          this.reload();
          this.results = data['results']
        },
        error => {
          console.log(error);
          this.logService.logAction('ERROR Add Modifier ' + a['descs'] + '(' + a['id'] + ') @' + a['price'], this.id)
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
            this.results = data['results']
          this.logService.logAction('Apply Discount Group ' + a['name'] + '(' + a['id'] + ') @' + a['discRate'] + '%', this.id)
        },
        error => {
          console.log(error);
          this.logService.logAction('ERROR Apply Discount Group ' + a['name'] + '(' + a['id'] + ') @' + a['discRate'] + '%', this.id)
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
        history.back();
        this.logService.logAction('Send Order', this.id);
        
      },
      error => {
        console.log(error);
        this.logService.logAction('ERROR Send Order', this.id)
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
          this.logService.logAction('Exit Without Order', this.id)
          console.log(data);
          this.router.navigate(['tables']);
        },
        error => {
          console.log(error);
          this.logService.logAction('ERROR Exit Without Order', this.id)
        }
      )
    }
  }

  payment() {
    this.logService.logAction('Click PAYMENT', this.id)
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

        history.back();
        setTimeout(() => {
          this.router.navigate(['payment'], { queryParams: { id: this.id } });
          this.logService.logAction('Update to payment', this.id)
        }, 500);
      },
      error => {
        console.log(error);
        this.logService.logAction('ERROR Update to payment', this.id)
      }
    )
  }

  printToKitchen() {
    window.open(environment.api + "printing/kitchen?id=" + this.id);
    // this.http.get<any>(environment.api+"printing/tableChecker",{
    //   params : {
    //     id : this.id
    //   }
    // }).subscribe(
    //   data=>{
    //     console.log(data);
    //   },
    //   error=>{
    //     console.log(error);
    //   }
    // )
  }

  printTableChecker() {
    window.open(environment.api + "printing/tableChecker?id=" + this.id);
    // this.http.get<any>(environment.api+"printing/tableChecker",{
    //   params : {
    //     id : this.id
    //   }
    // }).subscribe(
    //   data=>{
    //     console.log(data);
    //   },
    //   error=>{
    //     console.log(error);
    //   }
    // )
  }

  handleData(data: string) {


    let newQty = this.model.newQty.toString();
    if (data == 'b') {
      newQty = newQty.slice(0, -1);
    } else {
      newQty = newQty + data;
    }
    this.model.newQty = parseInt(newQty || '0'); // fallback kalau cover kosong

  }

  transferItems() {
    this.logService.logAction('menu/transferItems', this.id)
    this.router.navigate(['menu/transferItems'], { queryParams: { id: this.id } }).then(
      () => { this.modalService.dismissAll() }
    )
  }

  transferItemsGroup() {
    this.logService.logAction('menu/transferItemsGroup', this.id)
    this.router.navigate(['menu/transferItemsGroup'], { queryParams: { id: this.id } }).then(
      () => { this.modalService.dismissAll() }
    )
  }

  transferLog() {
    this.logService.logAction('Popup transfer Log', this.id)
    const modalRef = this.modalService.open(TransferLogComponent, { size: 'lg' });
    modalRef.componentInstance.cartId = this.id;
  }
  mergerLog() {
    this.logService.logAction('Popup transfer Log', this.id)
    const modalRef = this.modalService.open(MergerLogComponent, { size: 'lg' });
    modalRef.componentInstance.cartId = this.id;
  }

  takeOut() {
    if (this.isChecked == false) {
      alert("Please check item first!");
    } else {
      let cart: any[] = [];
      this.cart.forEach((el: any) => {
        if (el['checkBox'] == 1) {
          cart.push(el)
        }

      });

      let cartOrdered: any[] = [];
      this.cartOrdered.forEach((el: any) => {
        if (el['checkBox'] == 1) {
          cartOrdered.push(el)
        }

      });

      console.log(this.cart)

      this.loading = true;
      const body = {
        cart: cart,
        cartOrdered: cartOrdered,
        cartId: this.id,
      }
      const url = environment.api + "menuItemPos/takeOut";
      this.http.post<any>(url, body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          this.logService.logAction('Item TA ' + cart.length, this.id)
          console.log(data);
          this.reload();
        },
        error => {
          console.log(error);
          this.logService.logAction('ERROR Item TA' + cart.length, this.id)
        }
      )
    }
  }


  httpTables() {
    this.modalService.dismissAll();
    this.loading = true;
    const url = environment.api + "tableMap";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        outletId: this.configService.getConfigJson()['outlet']['id'],
      }
    }).subscribe(
      data => {
        this.loading = false;
        console.log('httpTables', data);
        this.tablesMaps = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }

  openTables(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  onMap(index: number) {
    localStorage.setItem("pos3.onMap", index.toString());
    this.current = index;
  }


  mergerCheck(x: any) {
    console.log(x);

    if (x.cardId != '' && x.cardId != this.table['id']) {
      this.logService.logAction("Merge table with " + x.tableName + " ?", this.id)
      if (confirm("Merge table with " + x.tableName + " ?")) {
        this.loading = true;
        const body = {
          cartId: this.id,
          table: this.table,
          newTable: x,
          dailyCheckId: this.configService.getDailyCheck(),
        }
        console.log(body);
        const url = environment.api + "menuItemPos/mergerCheck";
        this.http.post<any>(url, body, {
          headers: this.configService.headers(),
        }).subscribe(
          data => {
            console.log(data);
            history.back();
            this.logService.logAction("Merge to table :" + x.tableName, this.id)
          },
          error => {
            console.log(error);
            this.logService.logAction("ERROR Merge to table :" + x.tableName, this.id)
          }
        )
      }
    } else {
      alert("Please select active table");

    }
  }
}
