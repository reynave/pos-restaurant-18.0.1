import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TreeModule } from '@ali-hm/angular-tree-component';
import { LoginComponent } from './login/login.component';
import { ConfigService } from './service/config.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,TreeModule, LoginComponent, NgbNavModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  active = 1;
  login : boolean = false;
  
  title = 'admin18.0.1';
  nodes : any  = [
    {
      name: 'Employees', href: 'employee', icon:'<i class="bi bi-folder"></i>',
      children: [
        { name: 'All Employees', href: 'employee', icon:'' },
        { name: 'auth_level', href: 'home1', icon:'' },
        { name: 'dept', href: 'home2', icon:'' },
        { name: 'order_level', href: 'home3', icon:'' },
        
      ]
    },
    {
      name: 'Employee', icon:'<i class="bi bi-folder"></i>',href: 'employee',
    }
  ];

  options : any = {};
  constructor(
    private router: Router,
     private config: ConfigService,
  ){
  }
  ngOnInit(): void {
      this.checkLogin()
  }

  checkLogin(){
    console.log("this.config.checkToken() ",this.config.checkToken() );
    if(this.config.checkToken() == false){ 
      this.router.navigate(['login']);
    }else{
      this.login = true;  
    }
  }

  onEvent(data : any){
    console.log('onEvent', data.node.data);
    this.router.navigate([data.node.data.href]);
  }
}
