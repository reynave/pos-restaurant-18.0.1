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
import { VoidCodeComponent } from './module/others/void-code/void-code.component';
import { PantryMessageComponent } from './module/others/pantry-message/pantry-message.component';
import { FunctionAuthorityComponent } from './module/others/function-authority/function-authority.component';
import { FunctionListComponent } from './module/others/function-list/function-list.component';
import { FunctionShortCutsComponent } from './module/others/function-short-cuts/function-short-cuts.component';
import { MemberProfileComponent } from './module/member/member-profile/member-profile.component';
import { MemberClassesComponent } from './module/member/member-classes/member-classes.component';
import { MemberPeriodComponent } from './module/member/member-period/member-period.component';
import { MemberAccountComponent } from './module/member/member-account/member-account.component';
import { MemberAccountHolderComponent } from './module/member/member-account-holder/member-account-holder.component';
import { CostCentreComponent } from './module/member/cost-centre/cost-centre.component';
import { ComplaintCategoryComponent } from './module/complaint/complaint-category/complaint-category.component';
import { ComplaintTypeComponent } from './module/complaint/complaint-type/complaint-type.component';
import { CustomerInfoComponent } from './module/customer/customer-info/customer-info.component';
import { CustomerGrpComponent } from './module/customer/customer-grp/customer-grp.component';
import { TemplatesComponent } from './module/templates/templates.component';
import { TemplateDetailComponent } from './module/templates/template-detail/template-detail.component';
import { StationTaxRunComponent } from './module/workstation/station-tax-run/station-tax-run.component';
import { PantryStationQueueComponent } from './module/workstation/pantry-station-queue/pantry-station-queue.component';
import { PantryStationComponent } from './module/workstation/pantry-station/pantry-station.component';
import { TableMapComponent } from './module/table-map/table-map.component';

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


    { path: 'other/voidCode', component: VoidCodeComponent },
    { path: 'other/pantryMessage', component: PantryMessageComponent },
    { path: 'other/functionAuthority', component: FunctionAuthorityComponent },
    { path: 'other/functionList', component: FunctionListComponent },
    { path: 'other/functionShortCuts', component: FunctionShortCutsComponent },


    { path: 'member/profile', component: MemberProfileComponent },
    { path: 'member/classes', component: MemberClassesComponent },
    { path: 'member/period', component: MemberPeriodComponent },
    { path: 'member/account', component: MemberAccountComponent },
    { path: 'member/accountHolder', component: MemberAccountHolderComponent },
    { path: 'member/costCentre', component: CostCentreComponent },

    { path: 'complaint/category', component: ComplaintCategoryComponent },
    { path: 'complaint/type', component: ComplaintTypeComponent },

    { path: 'customer/info', component: CustomerInfoComponent },
    { path: 'customer/grp', component: CustomerGrpComponent },
 
    { path: 'template', component: TemplatesComponent },
    { path: 'template/detail', component: TemplateDetailComponent },
    // { path: 'template/kitchenMessage', component: TemplatesComponent },
    // { path: 'template/kitchenMonitor', component: TemplatesComponent },
    // { path: 'template/kitchenSlip', component: TemplatesComponent },
    { path: 'workStation/pantryStation', component: PantryStationComponent },
    { path: 'workStation/printQueue', component: PantryStationQueueComponent },
    
    { path: 'workStation/stationTaxRun', component: StationTaxRunComponent },

    { path: 'tableMap', component: TableMapComponent },
    
 

    { path: '**', component: PageNotFoundComponent },
];
