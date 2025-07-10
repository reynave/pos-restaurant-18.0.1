import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../service/config.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule,],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent implements OnInit {
  loading : boolean = false;
  items : any = [];
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
  ) { }


  ngOnInit(): void {
    this.httpGet();
  }

  httpGet() {
    this.loading = true;
    const url = environment.api + "workStation/terminal";
    this.http.get<any>(url, {
      headers: this.configService.headers(), 
    }).subscribe(
      data => {
        this.items = data['items']
        console.log(data); 
           this.loading = false;
      },
      error => {
        console.log(error);
           this.loading = false;
      }
    )
  }


  update(){
    this.loading = true;
    const url = environment.api + "workStation/terminal/update";
    const body = {
      items : this.items,
    }
    this.http.post<any>(url, body, {
      headers: this.configService.headers(), 
    }).subscribe(
      data => { 
         this.loading = false;
        console.log(data); 
      },
      error => {
           this.loading = false;
        console.log(error);
      }
    )
  }
}
