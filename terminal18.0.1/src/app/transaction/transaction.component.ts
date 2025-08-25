import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderMenuComponent } from "../header/header-menu/header-menu.component";
import { BillComponent } from '../pos/bill/bill.component';

@Component({
  selector: 'app-transaction',
  standalone: true,
   imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, HeaderMenuComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {
  loading: boolean = false;
  items: any = [{
    menu: []
  }];
  item: any = []; 
  outletSelect : any = [];
  outletId : number =0;
  id: string = ''; 
  api: string = environment.api;  
   screenWidth: number = window.innerWidth;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) { 
     window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
  }


  ngOnInit() { 
    this.outletId = this.configService.getConfigJson()['outlet']['id'];
    this.modalService.dismissAll(); 
    this.httpOutlet(); 

  }
  httpOutlet() {
    this.loading = true;
    const url = environment.api + "login/outlet";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        this.outletSelect = data['outletSelect']; 
        this.httpGet(); 
      },
      error => {
        console.log(error);
      }
    )
  }

  httpGet() {
    this.loading = true;
    const url = environment.api + "transaction";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        outletId:  this.outletId,
      }
    }).subscribe(
      data => {
        this.items = data['items']; 
      },
      error => {
        console.log(error);
      }
    )
  }

  goToDetail(x : any){
    this.router.navigate(['transaction/detail'], { queryParams : {id : x.id}})
  }
  
  back(){
    history.back();
  }

  openComponent(id : string){ 
      const modalRef = this.modalService.open(BillComponent, {size:'lg'});
      modalRef.componentInstance.id = id;
    }
}
