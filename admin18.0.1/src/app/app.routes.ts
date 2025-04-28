import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmployeeComponent } from './module/employee/employee.component';
import { OutletComponent } from './module/outlet/outlet.component'; 
import { AuthLevelComponent } from './module/employee/auth-level/auth-level.component';
import { DeptEmployeeComponent } from './module/employee/dept-employee/dept-employee.component';
import { OrderLevelEmployeeComponent } from './module/employee/order-level-employee/order-level-employee.component';
import { SpecialHoursComponent } from './module/special-hours/special-hours.component';
import { HolidayListComponent } from './module/holiday-list/holiday-list.component';
import { PaymentTypeComponent } from './module/payment/payment-type/payment-type.component';
import { PaymentGroupComponent } from './module/payment/payment-group/payment-group.component';

export const routes: Routes = [
    { path: '',component: HomeComponent},
    { path: 'home', component: HomeComponent },
    { path: 'employee', component: EmployeeComponent },
    { path: 'employee/authLevel', component: AuthLevelComponent },
    { path: 'employee/dept', component: DeptEmployeeComponent },
    { path: 'employee/orderLevel', component: OrderLevelEmployeeComponent },
    
    { path: 'outlet', component: OutletComponent },

    { path: 'specialHour', component: SpecialHoursComponent },
    { path: 'holidayList', component: HolidayListComponent },

    { path: 'payment/paymentType', component: PaymentTypeComponent },
    { path: 'payment/paymentGroup', component: PaymentGroupComponent },

    
    { path: '**', component: PageNotFoundComponent },
];
