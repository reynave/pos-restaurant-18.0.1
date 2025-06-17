import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxCurrencyDirective } from "ngx-currency";

export class Actor {
  constructor(
    public desc1: string,
    public date: number,
  ) { }
}

@Component({
  selector: 'app-menu-lookup',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, NgbDatepickerModule, NgxCurrencyDirective],

  templateUrl: './menu-lookup.component.html',
  styleUrl: './menu-lookup.component.css'
})
export class MenuLookupComponent implements OnInit {
  // Map ID => isExpanded
  expandedMap: { [id: number]: boolean } = {};
  menuLookupId: number = 0;

  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  lookupItems: any = [];

  selectCategory: any = [];
  selectClass: any = [];
  selectDept: any = [];
  modalLoading: boolean = false;
  allItem: any = [];
  hideItemsUsed: boolean = false;
  model = new Actor('', 0);
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.httpGet();

  }

  httpGet() {
    this.loading = true;
    const url = environment.api + "menu/menuLookup/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.lookupItems = data['results'];
        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }



  toggleExpand(id: number) {
    this.expandedMap[id] = !this.expandedMap[id];
  }

  isExpanded(id: number): boolean {
    return this.expandedMap[id] ?? true; // default expanded
  }

  menuRow(x: any) {
    this.loading = true;
    this.menuLookupId = x.id
    const url = environment.api + "menu/menuLookup/items";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        menuLookupId: x.id,
      }
    }).subscribe(
      data => {
        this.loading = false;
        this.items = data['items'];
        console.log(data);
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )
  }

  removeLookup() {
    const s: any[] = [];

    this.items.forEach((el: any) => {
      if (el.checkBox == 1) {
        s.push(el.id);
      }
    });

    this.loading = true;
    const url = environment.api + "menu/menuLookup/removeLookup";
    const body = {
      menuLookupId: this.menuLookupId,
      list: s
    }
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),

    }).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        const tmp = {
          id: this.menuLookupId
        }
        this.menuRow(tmp)
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )

    console.log(s);
  }




  cancel() {
    this.disabled = true;
    this.httpGet();
  }


  open(content: any) {

    this.httpGetAllItem()

    this.modalService.open(content, { size: 'lg' });
  }

  httpGetAllItem() {
    this.modalLoading = true;
    const url = environment.api + "menu/menuLookup/allItem";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.modalLoading = false;
        this.allItem = data['items'];
        console.log(data);
      },
      error => {
        this.modalLoading = false;
        console.log(error);
      }
    )
  }

  onSubmitLookupMenu() {
    const s: any[] = [];

    this.allItem.forEach((el: any) => {

      el.menu.forEach((row: any) => {
        if (row.checkBox == 1) {
          s.push(row.id);
        }
      });

    });

    // for (let i = 0; i < this.allItem.length; i++) {
    //   for (let n = 0; n < this.allItem.length; n++) {

    //   }
    // }

    this.loading = true;
    const url = environment.api + "menu/menuLookup/onSubmitLookupMenu";
    const body = {
      menuLookupId: this.menuLookupId,
      items: s
    }
    console.log(body)

    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.modalLoading = false;
        this.httpGetAllItem();
        const tmp = {
          id: this.menuLookupId
        }
        this.menuRow(tmp);
        this.modalService.dismissAll();
      },
      error => {
        this.modalLoading = false;
        console.log(error);
      }
    )
  }


  updateLookUp(item: any) {
    console.log(item);
    this.loading = true;
    const url = environment.api + "menu/menuLookup/updateLookUp";
    const body = {
      item: item
    }

    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )
  }
  postCreate(item: any) {

    this.loading = true;
    const url = environment.api + "menu/menuLookup/postCreate";
    const body = {
      item: item
    }
    console.log(body);
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.httpGet();
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )
  }

  deleteTree(item: any) {
    if (confirm("Delete this look up ?")) {
      this.loading = true;
      const url = environment.api + "menu/menuLookup/deleteTree";
      const body = {
        item: item
      }
      console.log(body);
      this.http.post<any>(url, body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          this.httpGet();
          this.loading = false;
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      )
    }
  }
}

