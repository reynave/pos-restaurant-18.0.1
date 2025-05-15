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
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  loading: boolean = false;
  current: number = 0;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [{
    menu: []
  }];
  card: any = [];
  id : string = '';
totalAmount : number = 0;
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
    this.httpMenu();
    this.httpCart();
  }
  httpMenu() {
    this.loading = true;
    const url = environment.api + "menuItemPos";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        departmentId: 0,
      }
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
    const url = environment.api + "menuItemPos/cart";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
      }
    }).subscribe(
      data => {
        console.log(data);
        this.card = data['items'];
        this.totalAmount = data['totalAmount']
      },
      error => {
        console.log(error);
      }
    )
  }
  reload() {
    this.httpMenu();
  }

  item : any = [];
  open(content: any, x: any, i : number) { 
    this.item = x;
    this.modalService.open(content);
  }
  addToCart(menu: any) {
    console.log(menu);
    const body = {
      id: this.activeRouter.snapshot.queryParams['id'],
      menu: menu,
    }
    this.http.post<any>(environment.api + "menuItemPos/addToCart", body, {
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
  
  updateQty(){
    const body = {
      model : this.model,
      item : this.item,
      cardId : this.activeRouter.snapshot.queryParams['id'],
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
}
