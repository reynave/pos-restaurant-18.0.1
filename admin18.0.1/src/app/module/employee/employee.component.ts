import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [HttpClientModule,CommonModule,  FormsModule,  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit{
  disabled : boolean = true;
  items : any = [];
  constructor(
    public configService: ConfigService,  
    private http: HttpClient, 
  ){}

  ngOnInit(): void {
     this.httpGet();
  }

  httpGet(){
    const url = environment.api+"employee";
    console.log(url);
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data=>{
        console.log(data);
        this.items = data['items'];
      },
      error=>{
        console.log(error);
      }
    )
  }

}
