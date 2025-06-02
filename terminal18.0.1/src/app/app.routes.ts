import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SetupComponent } from './setup/setup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guard/auth.guard';
import { TablesComponent } from './pos/tables/tables.component';
import { MenuComponent } from './pos/menu/menu.component';
import { MenuModifierComponent } from './pos/menu/menu-modifier/menu-modifier.component';
import { BillComponent } from './pos/bill/bill.component';
import { PaymentComponent } from './pos/payment/payment.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SettingComponent } from './setting/setting.component';
import { TransactionDetailComponent } from './transaction/transaction-detail/transaction-detail.component';
import { TransactionBillComponent } from './transaction/transaction-bill/transaction-bill.component';
import { DailyStartComponent } from './pos/daily/daily-start/daily-start.component';

export const routes: Routes = [
    { path: '', component: SetupComponent },
    { path: 'setup', component: SetupComponent },
    { path: 'login', component: LoginComponent },

    { path: 'setting', component: SettingComponent, canActivate: [authGuard] },

    { path: 'tables', component: TablesComponent, canActivate: [authGuard] },
    { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
    { path: 'menu/modifier', component: MenuModifierComponent, canActivate: [authGuard] },
    { path: 'bill', component: BillComponent, canActivate: [authGuard] },
    { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },


    { path: 'transaction', component: TransactionComponent, canActivate: [authGuard] },
    { path: 'transaction/bill', component: TransactionBillComponent, canActivate: [authGuard] },
    { path: 'transaction/detail', component: TransactionDetailComponent, canActivate: [authGuard] },

     { path: 'daily/start', component: DailyStartComponent, canActivate: [authGuard] },


    { path: '**', component: PageNotFoundComponent },
];
