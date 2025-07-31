import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
export class Actor {
  constructor(
    public name: string,
    public modifierListId: number,
  ) { }
}
@Component({
  selector: 'app-modifier',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, NgbDatepickerModule],
  templateUrl: './modifier.component.html',
  styleUrl: './modifier.component.css'
})
export class ModifierComponent implements OnInit {
  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];

  modifierGroup: any = [];
  modifierList: any = [];

  modifierListId: string = '';
  model = new Actor('', 0);
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  
     this.activatedRoute.queryParams.subscribe(params => {
      //console.log('Query Params changed:', params);
      this.modifierListId = params['modifierListId'];
      this.model['modifierListId'] = params['modifierListId'];
      this.httpMaster();
    });
  }

  httpMaster() {
    this.loading = true;
    const url = environment.api + "menu/modifier/master/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),

    }).subscribe(
      data => {
        console.log(data);
        this.httpGet();
        this.modifierList = data['modifierList'];
        this.modifierGroup = data['modifierGroup'];

        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }

  httpGet() {
    this.loading = true;
    const url = environment.api + "menu/modifier/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
       params: {
        modifierListId: this.modifierListId,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.items = data['items'];
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
    const url = environment.api + "menu/modifier/update";
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
      const url = environment.api + "menu/modifier/delete";
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
    const url = environment.api + "menu/modifier/create";
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

}
