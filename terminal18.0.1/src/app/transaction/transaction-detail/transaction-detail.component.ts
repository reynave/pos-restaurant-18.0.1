import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxCurrencyDirective } from "ngx-currency";
import { HeaderMenuComponent } from "../../header/header-menu/header-menu.component";
 
@Component({
  selector: 'app-transaction-detail',
  standalone: true,
   imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, NgxCurrencyDirective, HeaderMenuComponent],
 
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css'
})
export class TransactionDetailComponent implements  OnInit {
   @ViewChild('myModal', { static: true }) myModal: any;
  loading: boolean = false;
  items: any =  []; 
  id: string = ''; 
  api: string = '';  
  showModifier : number = 0;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) { }


  ngOnInit() {
    this.api = this.configService.getApiUrl();
    this.id = this.activeRouter.snapshot.queryParams['id'],
    this.modalService.dismissAll();
 
    this.httpGet();
  }
 
  back(){
    history.back();
  }

  httpGet() {
    this.loading = true;
    const url = this.api + "transaction/detail";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.activeRouter.snapshot.queryParams['id'],
      }
    }).subscribe(
      data => {
        console.log(data);
        this.items = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }
  
 
  
 
}

