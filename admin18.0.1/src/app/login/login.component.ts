import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../service/config.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export class Mylogin {
  constructor(public username: string, public password: string) {}
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model = new Mylogin('', '');
  ver: string = environment.ver;
  loading: boolean = false;
  warning: string = '';
  constructor(
    private config: ConfigService,
    private router: Router,
    private http: HttpClient
  ) {}
  onSubmit() {
    this.loading = true;
    const url = environment.api + 'login/admin';
    const body = this.model;
    this.http.post<any>(url, body).subscribe(
      (data) => {
        this.warning = '';
        console.log(data);
        this.config.setToken(data['token']).subscribe(
          data => {
            console.log(data);
            if (data == true) {
              this.router.navigate(['/']).then(()=>{
                window.location.reload();
              })
            }
          }
        )
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.warning = 'Login failed. Please check your username and password.';
        this.loading = false;
      }
    );
  }
}
