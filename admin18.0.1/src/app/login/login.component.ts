import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../service/config.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';


export class Mylogin {
  constructor(
    public username: string,
    public password: string,
  ) { }
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  model = new Mylogin('', '');
  ver : string = environment.ver;
  constructor(
    private config: ConfigService,
    private router: Router,
  ) { }
  onSubmit() {
    this.config.setToken({}).subscribe(
      data => {
        console.log(data);
        if (data == true) {
          this.router.navigate(['/']).then(()=>{
            window.location.reload();
          }) 
        }
      }
    )

  }
}
