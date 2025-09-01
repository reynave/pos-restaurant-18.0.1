import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { ConfigService } from '../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { KeyNumberComponent } from "../keypad/key-number/key-number.component";

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
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule, KeyNumberComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  error: string = '';
  model: any = new Actor('', '', 0);
  loading: boolean = false;
  ver: string = environment.ver;
  outletSelect: any = [];
  employeeSelect: any = [];
  api : string = localStorage.getItem('pos3.env.api') || environment.api;
  
  constructor(
    private config: ConfigService,
    private router: Router,
    private http: HttpClient, 
  ) { }

  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
    
    this.httpGet();

    if (this.config.getConfigJson() !== null) {
      this.router.navigate(['tables']);
    }
  }

  httpGet() {
    this.loading = true;
    const url = this.api + "login/outlet";
    this.http.get<any>(url).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.outletSelect = data['outletSelect'];
        this.employeeSelect = data['employeeSelect'];
        this.model.outletId = data['outletSelect'][0]['id'];
      },
      error => {
        console.log(error);
      }
    )
  }
 
  onSubmit() {
    this.error = '';
    const getIndexById = this.outletSelect.findIndex((obj: { id: any; }) => obj.id === parseInt(this.model.outletId));

    const url = this.api + "login/signin";
    const body = {
      // username: this.employeeSelect[this.model.username]['id'],
      username: this.model['username'], 
      password: this.model['password'],
      outletId: this.model['outletId'],
    }
    //console.log(body, this.employeeSelect[this.model.username]['id'], this.employeeSelect[this.model.username]['name'])
    this.http.post<any>(url, body).subscribe(
      data => {
        console.log(data);
        this.loading = false;

        const myJSONString = JSON.stringify({ 
          outlet: {
            id: this.model.outletId,
            name: this.outletSelect[getIndexById]['name'],
          },
          printer: {
            con: 'ip',
            address: '10.51.122.20',
            port: 9100,
            name: 'ESC/POS (Epson-style)'
          }
        });
        //  console.log(myJSONString);
        let dailyCheck = data['dailyCheck']
        this.config.setToken(myJSONString, data['token']).subscribe(
          data => {
             this.config.isLogin();
            console.log(dailyCheck);
            if (dailyCheck[0] == null) {
              this.router.navigate(['/daily/start']);
            } else {
              localStorage.setItem("pos3.dailyCheck.mitralink", dailyCheck[0]['id']);
              this.router.navigate(['/tables']);
            }

          }
        )
        this.error = '';
      },
      error => {
        console.log(error);
        this.error = error['error']['message'];
      }
    )
  }
 
  handleData(data: string) {
    console.log(data);

    if (data == 'b') {
      this.model.password = this.model.password.slice(0, -1);
      console.log(data)
    } else {
      this.model.password = this.model.password + data;
    }

  }
}
