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
      name: 'Employees', href: 'employee', icon:'<i class="bi bi-person-vcard"></i> ',
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
        { name: 'Foreign Currency', href: 'payment/foreignCurrency', icon:'' },
        { name: 'Cash Type', href: 'payment/cashType', icon:'' }, 
        { name: 'Tax', href: 'payment/taxType', icon:'' }, 
        { name: 'Service Charge (SC)', href: 'payment/serviceCharge', icon:'' }, 
        { name: 'Pay In and Out', href: '', icon:'' }, 
        { name: 'Member Deposit', href: '', icon:'' }, 
        { name: 'IC Card Add Value', href: 'payment/icCard', icon:'' }, 
        { name: 'WP Deposit Add Value', href: 'payment/wbDeposit', icon:'' }, 
        { name: 'WP Svc Card Add Value', href: 'payment/wpSvcCard', icon:'' },  
      ]
    },

    {
      name: 'Kitchen', href: 'template', icon:'<i class="bi bi-fire"></i>',
      children: [
        { name: 'Kitchen Slip', href: 'template/kitchenSlip', icon:'' },
        { name: 'Kitchen Message', href: 'template/kitchenMessage', icon:'' },
        { name: 'Kitchen Monitor', href: 'template/kitchenMonitor', icon:'' },  
      ]
    },


    {
      name: 'Other', href: '', icon:'<i class="bi bi-folder"></i>',
      children: [
        { name: 'Void Code', href: 'other/voidCode', icon:'' },
        { name: 'Pantry Message', href: 'other/pantryMessage', icon:'' },
        { name: 'Function Authority', href: 'other/functionAuthority', icon:'' },  
        { name: 'Function List', href: 'other/functionList', icon:'' },  
        { name: 'Function Short Cuts', href: 'other/functionShortCuts', icon:'' },   
      ]
    }, 
 
    {
      name: 'Membership', href: 'member/profile', icon:'<i class="bi bi-postcard-heart"></i>',
      children: [
        { name: 'Member Profiles', href: 'member/profile', icon:'' }, 
        { name: 'Member Classes', href: 'member/classes', icon:'' }, 
        { name: 'Member Period', href: 'member/period', icon:'' }, 
        { name: 'Member Account', href: 'member/account', icon:'' }, 
        { name: 'Member Account Holder', href: 'member/accountHolder', icon:'' }, 
        { name: 'Cost Centre', href: 'member/costCentre', icon:'' }, 
        
      ]
    },

    {
      name: 'Complaint', href: 'complaint/type', icon:'<i class="bi bi-people"></i>',
      children: [
        { name: 'Complaint Type', href: 'complaint/type', icon:'' }, 
        { name: 'Complaint Category', href: 'complaint/category', icon:'' },    
      ]
    },

    {
      name: 'Customer', href: 'customer/info', icon:'<i class="bi bi-people"></i>',
      children: [
        { name: 'Customer Info', href: 'customer/info', icon:'' },  
        { name: 'Customer Group', href: 'customer/grp', icon:'' },  
        
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
