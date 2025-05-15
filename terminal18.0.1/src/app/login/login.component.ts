import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { ConfigService } from '../service/config.service';


export class Actor {
  constructor( 
    public username: string,
    public password: string, 
  ) {}
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  model : any = new Actor('','');

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
          this.router.navigate(['/tables']);
        }
      }
    ) 
  }
}
