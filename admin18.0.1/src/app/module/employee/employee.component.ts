import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
export class Actor {
  constructor(
    public username: string,
    public passwd: string,
    public passwd2: string,

    public name: string,
    public authlevelId: string
  ) {}
}

export class Hero {
  constructor(
    public id: string,
    public passwd: string,
    public passwd2: string
  ) {}
}
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  selectDept: any = [];
  selectAuthLevel: any = [];
  selectOrdLevel: any = [];

  filterDept: string = '';
  filterAuthLevel: string = '';
  filterOrdLevel: string = '';

  model = new Actor('', '', '', '', '');
  changePassword = new Hero('', '', '');
  authlevelId: string = '';
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.authlevelId = params['authlevelId'];
      this.httpSelect();
    });
  }

  httpSelect() {
    this.loading = true;
    const url = environment.api + 'employee/select';
    console.log(url);
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.selectAuthLevel = data['auth_level'];

          this.httpGet();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  httpGet() {
    this.loading = true;
    const url = environment.api + 'employee';

    console.log(url);
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          authlevelId: this.authlevelId,
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
    const url = environment.api + 'employee/update';
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

  onDelete() {
    if (confirm('Delete this checklist?')) {
      this.loading = true;
      const url = environment.api + 'employee/delete';
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

  warning: string = '';
  onSubmit() {
    this.loading = true;
    const url = environment.api + 'employee/create';
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
          this.warning = '';
          this.httpGet();
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
          this.warning = error['error']['note'];
        }
      );
  }

  open(content: any) {
    this.modalService.open(content);
  }

  item: any = {};
  modalChangePassword(content: any, item: any) {
    this.item = item;
    this.changePassword.id = item.id;
    this.changePassword.passwd = '';
    this.changePassword.passwd2 = '';
    this.modalService.open(content, { size: 'sm' });
  }

  onSubmitChangePassword() {
    this.loading = true;
    const url = environment.api + 'employee/changePassword';
    const body = {
      model: this.changePassword,
    };
    this.http
      .post<any>(url, body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.warning = '';
          this.httpGet();
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
          this.warning = error['error']['note'];
        }
      );
  }
}
