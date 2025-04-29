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
import { CashTypeComponent } from './module/payment/cash-type/cash-type.component';
import { TaxTypeComponent } from './module/payment/tax-type/tax-type.component';
import { PaymentServiceChargeComponent } from './module/payment/payment-service-charge/payment-service-charge.component';
import { DiscGroupComponent } from './module/discount/disc-group/disc-group.component';
import { DiscTypeComponent } from './module/discount/disc-type/disc-type.component';
import { ForeignCurrencyTypeComponent } from './module/payment/foreign-currency-type/foreign-currency-type.component';
import { WpDepositComponent } from './module/payment/wp-deposit/wp-deposit.component';
import { WpSvcCardComponent } from './module/payment/wp-svc-card/wp-svc-card.component';
import { IcCardComponent } from './module/payment/ic-card/ic-card.component';

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

    { path: 'payment/cashType', component: CashTypeComponent },
    { path: 'payment/taxType', component: TaxTypeComponent },
    { path: 'payment/serviceCharge', component: PaymentServiceChargeComponent },
    { path: 'payment/foreignCurrency', component: ForeignCurrencyTypeComponent },
    { path: 'payment/wpSvcCard', component: WpSvcCardComponent },
    { path: 'payment/wbDeposit', component: WpDepositComponent },
    { path: 'payment/icCard', component: IcCardComponent },


    { path: 'discount/discGroup', component: DiscGroupComponent },
    { path: 'discount/discType', component: DiscTypeComponent },

    
    { path: '**', component: PageNotFoundComponent },
];
