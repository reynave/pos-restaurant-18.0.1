import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { NgxCurrencyDirective } from 'ngx-currency';
export class Actor {
  constructor(
    public name: string,
    public discRate: number,
    public discountGroupId: string,
    public allAccess: number
  ) {}
}
@Component({
  selector: 'app-discount',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgxCurrencyDirective,
  ],
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.css',
})
export class DiscountComponent implements OnInit {
  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  outletSelect: any = [];
  api: string = environment.api;
  id: string = '';
  model = new Actor('', 0, '', 1);
  path: string = environment.api + 'public/floorMap/icon/';
  selectGroup: any = [];
  selectAuthLevel: any = [];
  item: any = {};
  selectOutlet: any = [];
  indexItems: number = 0;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['discountGroupId'];
      this.httpDiscountGroup();
      this.model.discountGroupId = this.id;
    });
  }

  httpDiscountGroup() {
    this.loading = true;
    const url = environment.api + 'discount/group';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          this.selectGroup = data['items'];
          this.httpGet();
        },
        (error) => {
          console.log(error);
        }
      );
  }
 

  httpGet() {
    this.loading = true;
    const url = environment.api + 'discount';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          discountGroupId: this.id,
        },
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loading = false;
          this.items = data['items'];
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  checkAll() {
    if (this.checkboxAll == 0) {
      this.checkboxAll = 1;
      for (let i = 0; i < this.items.length; i++) {
        this.items[i]['checkbox'] = 1;
      }
    } else if (this.checkboxAll == 1) {
      this.checkboxAll = 0;
      for (let i = 0; i < this.items.length; i++) {
        this.items[i]['checkbox'] = 0;
      }
    }
  }

  cancel() {
    this.disabled = true;
    this.httpGet();
  }

  onUpdate() {
    this.loading = true;
    const url = environment.api + 'discount/update';
    const body = this.items;

    this.http
      .post<any>(url, body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  updateAuthLevel() {
    this.loading = true;
    const url = environment.api + 'discount/level/update';
    const body = {
      selectAuthLevel: this.selectAuthLevel,
      item: this.item,
    };
    this.http
      .post<any>(url, body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loading = false;

          this.items[this.indexItems]['totalDiscountLevel'] = data['total'];
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onDelete() {
    if (confirm('Delete this checklist?')) {
      this.loading = true;
      const url = environment.api + 'discount/delete';
      const body = this.items;
      this.http
        .post<any>(url, body, {
          headers: this.configService.headers(),
        })
        .subscribe(
          (data) => {
            console.log(data);
            this.httpGet();
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  onSubmit() {
    this.loading = true;
    const url = environment.api + 'discount/create';
    const body = {
      model: this.model,
    };
    this.http
      .post<any>(url, body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.modalService.dismissAll();
          this.model.name = '';

          this.httpGet();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  open(content: any, size: string = 'md') {
    this.modalService.open(content, { size: size });
  }

  openSelectLevel(
    content: any,
    item: any = [],
    index: number,
    size: string = 'md'
  ) {
    this.indexItems = index;
    const url = environment.api + 'discount/level';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          discountId: item['id'],
        },
      })
      .subscribe(
        (data) => {
          this.selectAuthLevel = data['items'];
        },
        (error) => {
          console.log(error);
        }
      );
    this.modalService.open(content, { size: size });
  }

  openSelectOutlet(
    content: any,
    item: any = [],
    index: number,
    size: string = 'md'
  ) {
    this.indexItems = index;
    const url = environment.api + 'discount/outlet';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          discountId: item['id'],
        },
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.selectOutlet = data['items'];
        },
        (error) => {
          console.log(error);
        }
      );
    this.modalService.open(content, { size: size });
  }

  updateDiscountOutlet() {
    this.loading = true;
    const url = environment.api + 'discount/outlet/update';
    const body = {
      selectOutlet: this.selectOutlet,
      item: this.item,
    };
    this.http
      .post<any>(url, body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loading = false;
          this.items[this.indexItems]['totalOutlet'] = data['total'];
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  fnCheckboxAll() {
    this.checkboxAll == 0 ? (this.checkboxAll = 1) : (this.checkboxAll = 0);

    this.selectAuthLevel.forEach((row: any) => {
      row.checkbox = this.checkboxAll;
    });

    this.selectOutlet.forEach((row: any) => {
      row.checkbox = this.checkboxAll;
    });
  }
}
