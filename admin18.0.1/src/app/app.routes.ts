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
import { DiscGroupComponent } from './module/general/discount/disc-group/disc-group.component'; 
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
import { FloorMapComponent } from './module/floor-map/floor-map.component';
import { OutletPaymentComponent } from './module/outlet/outlet-payment/outlet-payment.component';
import { OutletCashTypeComponent } from './module/outlet/outlet-cash-type/outlet-cash-type.component';
import { OutletDiscountComponent } from './module/outlet/outlet-discount/outlet-discount.component';
import { OutletSpecialHourComponent } from './module/outlet/outlet-special-hour/outlet-special-hour.component';
import { OutletTipsPoolComponent } from './module/outlet/outlet-tips-pool/outlet-tips-pool.component';
import { OutletMixAndMatchComponent } from './module/outlet/outlet-mix-and-match/outlet-mix-and-match.component';
import { OutletBonusRulesComponent } from './module/outlet/outlet-bonus-rules/outlet-bonus-rules.component';
import { OutletFuncAuthorityComponent } from './module/outlet/outlet-func-authority/outlet-func-authority.component';
import { MenuItemComponent } from './module/menu/menu-item/menu-item.component';
import { MenuDeptComponent } from './module/menu/menu-dept/menu-dept.component';
import { MenuCategoryComponent } from './module/menu/menu-category/menu-category.component';
import { MenuClassComponent } from './module/menu/menu-class/menu-class.component';
import { PrinterComponent } from './module/workstation/printer/printer.component';
import { MenuLookupComponent } from './module/menu/menu-lookup/menu-lookup.component';
import { TerminalComponent } from './module/workstation/terminal/terminal.component';
import { ModifierListComponent } from './module/menu/modifier-list/modifier-list.component';
import { ModifierGroupComponent } from './module/menu/modifier-group/modifier-group.component';
import { ModifierComponent } from './module/menu/modifier/modifier.component';
import { TableMapTemplateComponent } from './module/table-map/table-map-template/table-map-template.component';
import { DailyScheduleComponent } from './module/general/daily-schedule/daily-schedule.component';
import { DiscountComponent } from './module/general/discount/discount.component';
import { DailyReportComponent } from './module/report/daily-report/daily-report.component';
import { TransactionComponent } from './module/report/transaction/transaction.component';
import { UserLoginReportComponent } from './module/report/user-login-report/user-login-report.component';
import { TransactionDetailComponent } from './module/report/transaction/transaction-detail/transaction-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'employee/authLevel', component: AuthLevelComponent },
  { path: 'employee/dept', component: DeptEmployeeComponent },
  { path: 'employee/orderLevel', component: OrderLevelEmployeeComponent },

  { path: 'dailySchedule', component: DailyScheduleComponent },

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
  { path: 'discount/discGroup', component: DiscGroupComponent },
  { path: 'discount', component: DiscountComponent },

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
  { path: 'workStation/printer', component: PrinterComponent },
  { path: 'workStation/terminal', component: TerminalComponent },

  { path: 'outlet', component: OutletComponent },
  { path: 'outlet/payment', component: OutletPaymentComponent },
  { path: 'outlet/cashType', component: OutletCashTypeComponent },
  { path: 'outlet/discount', component: OutletDiscountComponent },
  { path: 'outlet/specialHour', component: OutletSpecialHourComponent },
  { path: 'outlet/tipsPool', component: OutletTipsPoolComponent },
  { path: 'outlet/mixAndMatch', component: OutletMixAndMatchComponent },
  { path: 'outlet/bonusRules', component: OutletBonusRulesComponent },

  { path: 'outlet/funcAuthority', component: OutletFuncAuthorityComponent },
  { path: 'outlet/orderLevel', component: OutletBonusRulesComponent },
  { path: 'outlet/specialHour', component: OutletSpecialHourComponent },

  { path: 'menu/item', component: MenuItemComponent },
  { path: 'menu/department', component: MenuDeptComponent },
  { path: 'menu/category', component: MenuCategoryComponent },
  { path: 'menu/class', component: MenuClassComponent },
  { path: 'menu/lookUp', component: MenuLookupComponent },

  { path: 'modifier/list', component: ModifierListComponent },
  { path: 'modifier/group', component: ModifierGroupComponent },
  { path: 'modifier', component: ModifierComponent },

  { path: 'report/dailyClose', component: DailyReportComponent },
  // { path: 'report/adjustmentItems', component:  },
  { path: 'report/transaction', component: TransactionComponent },
  { path: 'report/transaction/detail', component: TransactionDetailComponent },

  { path: 'report/userLogin', component: UserLoginReportComponent },

  { path: 'tableMap', component: TableMapComponent },
  { path: 'tableMap/template', component: TableMapTemplateComponent },

  { path: 'floorMap', component: FloorMapComponent },

  { path: '**', component: PageNotFoundComponent },
];
