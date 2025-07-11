import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
export class Actor {
  constructor(
    public desc1: string,
    public value: number,
  ) { }
}
export class Hero {
  constructor(
    public descl1: string,
    public descs1: string,
    public tel: string,
    public fax: string,
    public comname1: string,
    public addr1: string,
    public street1: string,
    public cityname1: string,
    public country1: string,
    public greeta1: string,
    public greetb1: string,
    public greetc1: string,
    public greetd1: string,
    public greete1: string,
    public dpoleu1: string,
    public dpolel1: string,
    public panelid: number,
    public price: number,
    public sendpend: string,
    public itmrnd: number,
    public taxrnd: number,
    public scrnd: number,
    public discrnd: number,
    public ckrnd: number,
    public itmdec: number,
    public taxdec: number,
    public scdec: number,
    public discdec: number,
    public ckdec: number,
    public begchk: number,
    public endchk: number,
    public nextchk: string,
    public bizbegchk: string,
    public drwprefix: string,
    public drwamt: string,
    public drwmethod: string,
    public drwrun: string,
    public printerId: string,

  ) { }
}



@Component({
  selector: 'app-outlet',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, NgbDatepickerModule],
  templateUrl: './outlet.component.html',
  styleUrl: './outlet.component.css'
})
export class OutletComponent implements OnInit {
  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  item: any = [];

  selectorderLevel: any = [];
  selectAuthLevel: any = [];
  selectOrdLevel: any = [];
 selectPrinter: any = [];


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
    const url = environment.api + "outlet/index/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.items = data['items'];
        this.selectPrinter = data['printer'];
        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }
  checkAll() {
    if (this.checkboxAll == 0) {
      this.checkboxAll = 1;
      for (let i = 0; i < this.items.length; i++) {
        this.items[i]['checkbox'] = 1;
      }
    }
    else if (this.checkboxAll == 1) {
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
    const url = environment.api + "outlet/index/update";
    const body = this.item;
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.httpGet();
      },
      error => {
        console.log(error);
      }
    )
  }

  onDelete() {
    if (confirm("Delete this checklist?")) {
      this.loading = true;
      const url = environment.api + "outlet/index/delete";
      const body = this.items;
      this.http.post<any>(url, body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.httpGet();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  onSubmit() {
    this.loading = true;
    const url = environment.api + "outlet/index/create";
    const body = {
      model: this.model,
    };
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        if (data['error'] == false) {
          this.model = new Actor('', 0);
          this.httpGet();
        } else {
          alert("INSERT ERROR");
        }

      },
      error => {
        console.log(error);
      }
    )
  }


  open(content: any) {
    this.modalService.open(content);
  }

  openLg(content: any, item: any) {
    this.item = item;
    this.modalService.open(content, { size: 'xl' });
  }

}
