import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderMenuComponent } from '../../header/header-menu/header-menu.component';
import { KeyNumberComponent } from '../../keypad/key-number/key-number.component';
import { ConfigService } from '../../service/config.service';
import { environment } from '../../../environments/environment';
import { UserLoggerService } from '../../service/user-logger.service';


@Component({
  selector: 'app-items',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, HeaderMenuComponent, KeyNumberComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {

  checkTotal: number = 0;
  isCheckAll: number = 0;
  addQty: number = 1;
  loading: boolean = false;
  items: any = [];
  newQty: number = 99999;
  api : string = '';
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    public logService: UserLoggerService
  ) { }
  ngOnInit(): void {
    this.api = this.configService.getApiUrl();
    this.httpMenu();
  }

  httpMenu() {
    this.checkTotal = 0;
    this.modalService.dismissAll();
    this.loading = true;
    const url = this.api + "items/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        departmentId: 0,
        outletId: this.configService.getConfigJson()['outlet']['id']
      }
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.items = data['items'];
        this.searchResults = this.items;
      },
      error => {
        console.log(error);
      }
    )
  }

  checkBoxAll() {
    if (this.isCheckAll == 0) this.isCheckAll = 1;
    else this.isCheckAll = 0;

    this.checkTotal = this.isCheckAll;
    for (let i = 0; i < this.searchResults.length; i++) {
      this.searchResults[i]['checkBox'] = this.isCheckAll;
    }
  }

  back() {
    history.back();
  }

  onAddQty() {
    const items: any[] = [];
    this.items.forEach((el: any) => {
      if (el['checkBox'] == 1) {
        items.push(el['id']);
      }
    });
    console.log(items, this.addQty);
    this.loading = true;
    const url = this.api + "items/addQty";
    const body = {
      items: items,
      addQty: this.addQty,
    }
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.logService.logAction('Add ' + this.addQty + ', Qty for ' + items.length + ' items  ')
        console.log(data);
        this.loading = false;
        this.httpMenu();
      },
      error => {
        console.log(error);
        this.logService.logAction('ERROR Add Qty')
      }
    )

  }

  onResetAdjust() {
    if ((confirm("Remove Adjustment item will be unlimited qty?"))) {
      const items: any[] = [];
      this.items.forEach((el: any) => {
        if (el['checkBox'] == 1) {
          items.push(el['id']);
        }
      });
      console.log(items);

      this.loading = true;
      const url = this.api + "items/resetAdjust";
      const body = {
        items: items
      }
      this.http.post<any>(url, body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          this.logService.logAction('REMOVE ADJUST / UNLIMITED ' + items.length + ' items')
          console.log(data);
          this.loading = false;
          this.httpMenu();
        },
        error => {
          this.logService.logAction('ERROR Reset Adjust')
          console.log(error);
        }
      )
    }
  }

  fnCheck(index: number) {
    this.searchResults[index].checkBox == 0 ? this.searchResults[index].checkBox = 1 : this.searchResults[index].checkBox = 0;

    this.checkTotal = 0;
    this.searchResults.forEach((el: any) => {
      if (el['checkBox'] == 1) {
        this.checkTotal += 1;
      }
    });
    console.log(this.checkTotal);
  }

  open(content: any) {

    this.modalService.open(content);
  }

  handleData(data: string) {
    let value = '';


    value = this.addQty.toString()
    if (data == 'b') {
      value = value.slice(0, -1);
      if (value.length < 1) {
        value = '0';
      }
    } else {
      value = value + data;
    }
    this.addQty = parseInt(value);

  }
  searchTerm = '';
  searchResults: any = [];
  searchByName() {
    this.searchResults = this.items.filter((item: { name: string; }) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
