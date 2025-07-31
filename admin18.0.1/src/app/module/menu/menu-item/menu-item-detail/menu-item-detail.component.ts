import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ConfigService } from '../../../../service/config.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-menu-item-detail',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDatepickerModule, NgxCurrencyDirective],

  templateUrl: './menu-item-detail.component.html',
  styleUrl: './menu-item-detail.component.css'
})
export class MenuItemDetailComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() item: any;
  @Input() masterData: any;

  startDate: any = {}
  endDate: any = {}
  selectMenu: any = [];
  menuSet: any = [];
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {

    const startDate = new Date(this.item.startDate);
    this.startDate = {
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1, // getMonth() itu 0-based
      day: startDate.getDate()
    };
    const endDate = new Date(this.item.endDate);

    this.endDate = {
      year: endDate.getFullYear(),
      month: endDate.getMonth() + 1, // getMonth() itu 0-based
      day: endDate.getDate()
    };
    this.httpGetMenu();
    this.httpGetItemDetail();
  }

  httpGetItemDetail() {

    const url = environment.api + "menu/menuSetDetail/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        menuId: this.item.id,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.menuSet = data['items']
      },
      error => {
        console.log(error);
      }
    )
  }

  addMenuSet() {
    const body = {
      menuId: this.item.id
    }
    const url = environment.api + "menu/addMenuSet/";
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);

        this.menuSet.push(data['item'])
      },
      error => {
        console.log(error);
      }
    )

  }

  fnUpdateMenuSet(item: any) {

    const body = {
      menuId: this.item.id,
      item: item
    }
    console.log(body);
    const url = environment.api + "menu/updateMenuSet/";
    this.http.post<any>(url, body, {
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

  fnRemoveMenuSet(index: number) {
    const body = {
      id: this.menuSet[index]['id']
    }
    console.log(body);
    const url = environment.api + "menu/removeMenuSet/";
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.menuSet.splice(index, 1);
      },
      error => {
        console.log(error);
      }
    )
  }

  httpGetMenu() {
    const url = environment.api + "menu/itemsList/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.selectMenu = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }

  onSubmit() {
    let date = {
      startDate: this.startDate['year'] + "-" + this.startDate['month'].toString().padStart(2, '0') + "-" + this.startDate['day'].toString().padStart(2, '0'),
      endDate: this.endDate['year'] + "-" + this.endDate['month'].toString().padStart(2, '0') + "-" + this.endDate['day'].toString().padStart(2, '0'),
    }
    console.log(date, this.item);

    const body = {
      id: this.item.id,
      menuSet: this.menuSet,
      item: this.item, 
      date : date
    }
    console.log(body);
    const url = environment.api + "menu/updateMenuDetail/";
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.activeModal.close(body); // kirim balik ke parent
      },
      error => {
        console.log(error);
      }
    )
  }


}
