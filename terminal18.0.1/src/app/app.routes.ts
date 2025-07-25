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
 
import { DailyCashBalanceComponent } from './pos/daily/daily-cash-balance/daily-cash-balance.component';
import { SplitBillComponent } from './pos/bill/split-bill/split-bill.component';
import { TransferItemsComponent } from './pos/menu/transfer-items/transfer-items.component';
import { TerminalLoginComponent } from './login/terminal-login/terminal-login.component';
import { terminalGuard } from './guard/terminal.guard';
import { TerminalReloginComponent } from './login/terminal-relogin/terminal-relogin.component';
import { loginGuard } from './guard/login.guard';
import { ItemsComponent } from './setting/items/items.component';
import { UserLogsComponent } from './setting/user-logs/user-logs.component';
import { TransferItemsGroupComponent } from './pos/menu/transfer-items-group/transfer-items-group.component';
import { ReloginComponent } from './login/relogin/relogin.component';
import { PrintQueueComponent } from './pos/print-queue/print-queue.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard, loginGuard] },
    { path: 'setup', component: SetupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'relogin', component: ReloginComponent },
    
    { path: 'login/terminal', component: TerminalLoginComponent },

    { path: 'setting', component: SettingComponent, canActivate: [authGuard, loginGuard] },

    // DAILYSTARTGUARD REQUREMENT
    { path: 'tables', component: TablesComponent, canActivate: [authGuard, dailyStartGuard, terminalGuard, loginGuard] },
    { path: 'menu', component: MenuComponent, canActivate: [authGuard, dailyStartGuard, terminalGuard, loginGuard] },
    { path: 'menu/modifier', component: MenuModifierComponent, canActivate: [authGuard, dailyStartGuard, terminalGuard, loginGuard] },
    { path: 'menu/transferItems', component: TransferItemsComponent, canActivate: [authGuard, dailyStartGuard, terminalGuard, loginGuard] },
    { path: 'menu/transferItemsGroup', component: TransferItemsGroupComponent, canActivate: [authGuard, dailyStartGuard, terminalGuard, loginGuard] },

    { path: 'bill', component: BillComponent, canActivate: [authGuard, dailyStartGuard ,terminalGuard, loginGuard] },
    { path: 'bill/splitBill', component: SplitBillComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard, loginGuard] },

    { path: 'payment', component: PaymentComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard, loginGuard] },
  { path: 'printQueue', component: PrintQueueComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard, loginGuard] },

    { path: 'items', component: ItemsComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard, loginGuard] },
    { path: 'userLogs', component: UserLogsComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard, loginGuard] },

    // END :: DAILYSTARTGUARD

    { path: 'transaction', component: TransactionComponent, canActivate: [authGuard,terminalGuard, loginGuard] },
    { path: 'transaction/bill', component: TransactionBillComponent, canActivate: [authGuard,terminalGuard, loginGuard] },
    { path: 'transaction/detail', component: TransactionDetailComponent, canActivate: [authGuard,terminalGuard, loginGuard] },

    { path: 'daily/start', component: DailyStartComponent, canActivate: [authGuard,terminalGuard, loginGuard] },
    { path: 'daily/close', component: DailyCloseComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard, loginGuard] },
    { path: 'daily/cashBalance', component: DailyCashBalanceComponent, canActivate: [authGuard, dailyStartGuard,terminalGuard, loginGuard] },

   

    { path: 'terminalRelogin', component: TerminalReloginComponent },

    { path: '**', component: PageNotFoundComponent },
];
