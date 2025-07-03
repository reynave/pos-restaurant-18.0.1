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
import { DailyCloseComponent } from './pos/daily/daily-close/daily-close.component';
import { dailyStartGuard } from './guard/daily-start.guard';
import { ItemsComponent } from './items/items.component';
import { DailyCashBalanceComponent } from './pos/daily/daily-cash-balance/daily-cash-balance.component';
import { SplitBillComponent } from './pos/bill/split-bill/split-bill.component';
import { TransferItemsComponent } from './pos/menu/transfer-items/transfer-items.component';
import { TerminalLoginComponent } from './login/terminal-login/terminal-login.component';
import { terminalGuard } from './guard/terminal.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'setup', component: SetupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/terminal', component: TerminalLoginComponent },

    { path: 'setting', component: SettingComponent, canActivate: [authGuard] },

    // DAILYSTARTGUARD REQUREMENT
    { path: 'tables', component: TablesComponent, canActivate: [authGuard, dailyStartGuard, terminalGuard] },
    { path: 'menu', component: MenuComponent, canActivate: [authGuard, dailyStartGuard, terminalGuard] },
    { path: 'menu/modifier', component: MenuModifierComponent, canActivate: [authGuard, dailyStartGuard, terminalGuard] },
    { path: 'menu/transferItems', component: TransferItemsComponent, canActivate: [authGuard, dailyStartGuard, terminalGuard] },

    { path: 'bill', component: BillComponent, canActivate: [authGuard, dailyStartGuard ,terminalGuard] },
    { path: 'bill/splitBill', component: SplitBillComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard] },

    { path: 'payment', component: PaymentComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard] },

    { path: 'items', component: ItemsComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard] },

    // END :: DAILYSTARTGUARD

    { path: 'transaction', component: TransactionComponent, canActivate: [authGuard,terminalGuard] },
    { path: 'transaction/bill', component: TransactionBillComponent, canActivate: [authGuard,terminalGuard] },
    { path: 'transaction/detail', component: TransactionDetailComponent, canActivate: [authGuard,terminalGuard] },

    { path: 'daily/start', component: DailyStartComponent, canActivate: [authGuard,terminalGuard] },
    { path: 'daily/close', component: DailyCloseComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard] },
    { path: 'daily/cashBalance', component: DailyCashBalanceComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard] },



    { path: '**', component: PageNotFoundComponent },
];
