import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { ConfigService } from '../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';


export class Actor {
  constructor(
    public username: string,
    public password: string,
    public outletId: number,

  ) { }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  model: any = new Actor('', '', 0);
  loading: boolean = false;
  ver: string = environment.ver;
  outletSelect : any = [];
  constructor(
    private config: ConfigService,
    private router: Router,
    private http: HttpClient
  ) { }


  ngOnInit(): void {
     this.httpGet();
  }
  httpGet() {
    this.loading = true;
    const url = environment.api + "login/outlet";
    this.http.get<any>(url).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.outletSelect = data['outletSelect'];
        this.model.outletId = data['outletSelect'][0]['id'];
      },
      error => {
        console.log(error);
      }
    )
  }


  onSubmit() {
    const getIndexById = this.outletSelect.findIndex((obj: { id: any; }) => obj.id === this.model.outletId);

    const myJSONString = JSON.stringify({
      employee : {
        id : 2,
        username : '00',
        name : 'Bu Eka'
      },
      outlet :{
        id  :  this.model.outletId, 
        name :  this.outletSelect[getIndexById]['name'],
      },  
      printer : {
        con : 'ip',
        address : '10.51.122.20',
        port : 9100,
        name : 'ESC/POS (Epson-style)'
      }
    }); 
    this.config.setToken(myJSONString).subscribe(
      data => {
        console.log(data);
        if (data == true) {
          this.router.navigate(['/tables']);
        }
      }
    )
  }
}
