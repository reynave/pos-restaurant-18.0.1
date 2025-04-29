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
      name: 'Employees', href: 'employee', icon:'<i class="bi bi-people"></i>',
      children: [
        { name: 'All Employees', href: 'employee', icon:'' },
        { name: 'Auth Level', href: 'employee/authLevel', icon:'' },
        { name: 'Departement', href: 'employee/dept', icon:'' },
        { name: 'Order Level', href: 'employee/orderLevel', icon:'' }, 
      ]
    },
    {
      name: 'Special Hours', href: 'specialHour', icon:'<i class="bi bi-alarm"></i>',
    }, 
    {
      name: 'Holiday List', href: 'holidayList', icon:'<i class="bi bi-calendar-week"></i>',
    },

    {
      name: 'Discount', href: '', icon:'<i class="bi bi-percent"></i>',
      children: [
        { name: 'Discount Group', href: 'discount/discGroup', icon:'' },  
        { name: 'Discount Type', href: 'discount/discType', icon:'' },   
      ]
    },


    {
      name: 'Payment', href: 'payment', icon:'<i class="bi bi-currency-dollar"></i>',
      children: [
        { name: 'Payment Type', href: 'payment/paymentType', icon:'' }, //check_payment_type
        { name: 'Payment Group', href: 'payment/paymentGroup', icon:'' }, //check_payment_group
        { name: 'Foreign Currency', href: '', icon:'' },
        { name: 'Cash Type', href: 'payment/cashType', icon:'' }, 
        { name: 'Tax', href: 'payment/taxType', icon:'' }, 
        { name: 'Service Charge (SC)', href: 'payment/serviceCharge', icon:'' }, 
        { name: 'Pay In and Out', href: '', icon:'' }, 
        { name: 'Member Deposit', href: '', icon:'' }, 
        { name: 'IC Card Add Value', href: '', icon:'' }, 
        { name: 'WP Deposit Add Value', href: '', icon:'' }, 
        { name: 'WP Svc Card Add Value', href: '', icon:'' },  
      ]
    },

    {
      name: 'Kitchen', href: '', icon:'',
      children: [
        { name: 'Kitchen Slip', href: '', icon:'' },
        { name: 'Kitchen Message', href: '', icon:'' },
        { name: 'Kitchen Monitor', href: '', icon:'' },  
      ]
    },
    
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

  onLogout(){
    this.config.removeToken().subscribe(
      data => {
          window.location.reload();
      }
    )
   
  }
}
