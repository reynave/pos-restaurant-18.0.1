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

export const routes: Routes = [
    { path: '', component: SetupComponent },
    { path: 'setup', component: SetupComponent },
    { path: 'login', component: LoginComponent },

    { path: 'tables', component: TablesComponent, canActivate: [authGuard] },
    { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
    { path: 'menu/modifier', component: MenuModifierComponent, canActivate: [authGuard] },
    { path: 'bill', component: BillComponent, canActivate: [authGuard] },
    { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
   

    { path: '**', component: PageNotFoundComponent },
];
