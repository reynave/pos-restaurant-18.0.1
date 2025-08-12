import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../../../service/config.service';
import { environment } from '../../../../environments/environment';
export class Actor {
  constructor(
    public printerTypeCon: string,
    public ip: string,
    public port: string,
    public name: string,

  ) { }
}
@Component({
  selector: 'app-printer-group',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, NgbDatepickerModule],
  templateUrl: './printer-group.component.html',
  styleUrl: './printer-group.component.css'
})
export class PrinterGroupComponent implements OnInit {
  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  selectOutlet: any = [];
  item: any = {}
  com: any = ['com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8',]
  note: string = 'Test';
  model = new Actor('', '', '', '');
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
    const url = environment.api + "workStation/printerGroup/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.items = data['items'];
        //  this.modalService.dismissAll();
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
    const url = environment.api + "workStation/printerGroup/update";
    const body = this.items;
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  onDelete() {
    if (confirm("Delete this checklist?")) {
      this.loading = true;
      const url = environment.api + "workStation/printerGroup/delete";
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
    const url = environment.api + "workStation/printerGroup/create";
    const body = {
      model: this.model,
    };
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        if (data['error'] == false) {
          //this.model = new Actor('', '', '','','');
          this.httpGet();
          this.modalService.dismissAll();
          this.loading = false;
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

  printLoading: boolean = false;
  printerRest : string = '';
  testPrint() {
    this.printLoading = true;
    this.printerRest = 'Conneting, please wait..';
    const url = environment.api + "workStation/printerGroup/test";
    const body = {
      item: this.item,
      note: this.note
    };
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
            this.printerRest = data['message'];
        this.printLoading = true;
        console.log(data);
      },
      error => {
         this.printerRest = error['error']['error'];
        this.printLoading = true;
        console.log(error);
      }
    )
  }
}
