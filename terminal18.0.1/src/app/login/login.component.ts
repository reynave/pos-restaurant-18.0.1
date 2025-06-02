import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { ConfigService } from '../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as bcrypt from 'bcryptjs';

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
  error: string = '';
  model: any = new Actor('', '', 0);
  loading: boolean = false;
  ver: string = environment.ver;
  outletSelect: any = [];
  employeeSelect: any = [];

  constructor(
    private config: ConfigService,
    private router: Router,
    private http: HttpClient,
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
        this.employeeSelect = data['employeeSelect'];

        this.model.outletId = data['outletSelect'][0]['id'];
      },
      error => {
        console.log(error);
      }
    )
  }


  onSubmit() {
    const saltRounds = 4;
    //const password = this.model['password'];
    // const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // let p1 = hashedPassword;
    // let p2 = bcrypt.hashSync(password, saltRounds);
    // let p3 = bcrypt.hashSync(password, saltRounds);;
    // let p4 = bcrypt.hashSync(password, saltRounds);;


    // console.log('Hashed:', hashedPassword,p2,p3,p4 );
    // console.log(bcrypt.compareSync(this.model['password'], hashedPassword));
    // console.log(bcrypt.compareSync(this.model['password'], p2));
    // console.log(bcrypt.compareSync(this.model['password']+'1', p3));

    const getIndexById = this.outletSelect.findIndex((obj: { id: any; }) => obj.id === this.model.outletId);

    this.loading = true;
    const url = environment.api + "login/signin";


    const body = {
      username: this.model['username'],
      password: this.model['password'],
      outletId: this.model['outletId'],
    }
    console.log(body)
    this.http.post<any>(url, body).subscribe(
      data => {
        console.log(data);
        this.loading = false;

        const myJSONString = JSON.stringify({
          employee: {
            id: 2,
            username: '00',
            name: 'Bu Eka'
          },
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
        console.log(myJSONString)
        // this.config.setToken(myJSONString, token).subscribe(
        //   data => {
        //     console.log(data);
        //     if (data == true) {
        //       this.router.navigate(['/tables']);
        //     }
        //   }
        // )
      },
      error => {
        console.log(error);
        this.error = error['error']['message'];
      }
    )



  }
}
