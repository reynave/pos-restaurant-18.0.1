import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TreeModule } from '@ali-hm/angular-tree-component';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,TreeModule, RouterLinkActive, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  login : boolean = false;
  
  title = 'admin18.0.1';
  nodes : any  = [
    {
      name: 'Root', icon:'<i class="bi bi-folder"></i>',
      children: [
        { name: 'Child 1', href: 'home', icon:'' },
        { name: 'Child 2', href: 'home2', icon:'' }
      ]
    },
    {
      name: 'Employee', icon:'<i class="bi bi-folder"></i>',href: 'employee',
    }
  ];

  options : any = {};
  constructor(
    private router: Router,
  ){
  }
  ngOnInit(): void {
      this.checkLogin()
  }

  checkLogin(){
    if(this.login == false){
      this.router.navigate(['login']);
    }else{
      this.router.navigate(['home']);
    }
  }
}
