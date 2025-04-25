import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [HttpClientModule,CommonModule,  FormsModule, NgbDropdownModule ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit{
  loading :boolean = false;
  checkboxAll : number = 0;
  disabled : boolean = true;
  items : any = [];
  selectDept :any = [];
  selectAuthLevel :any = [];
  selectOrdLevel :any = []; 
  
  filterDept :string = '';
  filterAuthLevel :string = '';
  filterOrdLevel :string = ''; 
  
  constructor(
    public configService: ConfigService,  
    private http: HttpClient, 
  ){}

  ngOnInit(): void { 
     this.httpSelect();
  }

  httpSelect(){
    this.loading = true;
    const url = environment.api+"employee/select";
    console.log(url);
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data=>{
        console.log(data);
        this.selectDept = data['dept'];
        this.selectAuthLevel = data['auth_level'];
        this.selectOrdLevel = data['order_level']; 
        
        this.httpGet();
      },
      error=>{
        console.log(error);
      }
    )
  }
  httpGet(){
    this.loading = true;
    const url = environment.api+"employee";
    const params = {
      filterDept : this.filterDept,
      filterAuthLevel : this.filterAuthLevel,
      filterOrdLevel : this.filterOrdLevel, 
    }
    console.log(url);
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params : params
    }).subscribe(
      data=>{
        console.log(data);
        this.loading = false;
        this.items = data['items'];
      },
      error=>{
        console.log(error);
      }
    )
  }
  checkAll(){
    if( this.checkboxAll == 0){
      this.checkboxAll = 1;
      for(let i = 0; i< this.items.length ; i++){
        this.items[i]['checkbox'] = 1;
      }
    }
    else if( this.checkboxAll == 1){
      this.checkboxAll = 0;
      for(let i = 0; i< this.items.length ; i++){
        this.items[i]['checkbox'] = 0;
      }
    } 
  }
  cancel(){
    this.disabled = true;
    this.httpGet();
  }
  onUpdate(){
    this.loading = true;
    const url = environment.api+"employee/update";
    const body = this.items;
    this.http.post<any>(url,body, {
      headers: this.configService.headers(),
    }).subscribe(
      data=>{
        console.log(data); 
        this.loading = false;
      },
      error=>{
        console.log(error);
      }
    )
  }

  onDelete(){
    this.loading = true;
    const url = environment.api+"employee/delete";
    const body = this.items;
    this.http.post<any>(url,body, {
      headers: this.configService.headers(),
    }).subscribe(
      data=>{
        console.log(data); 
        this.httpGet();
      },
      error=>{
        console.log(error);
      }
    )
  }
}
