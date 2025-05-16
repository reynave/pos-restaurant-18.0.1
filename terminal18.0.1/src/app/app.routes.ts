import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SetupComponent } from './setup/setup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './pos/cart/cart.component';
import { authGuard } from './guard/auth.guard';
import { TablesComponent } from './pos/tables/tables.component';
import { MenuComponent } from './pos/menu/menu.component'; 
import { MenuModifierComponent } from './pos/menu/menu-modifier/menu-modifier.component';

export const routes: Routes = [
    { path: '', component: SetupComponent },
    { path: 'setup', component: SetupComponent },
    { path: 'login', component: LoginComponent },

    { path: 'tables', component: TablesComponent, canActivate: [authGuard] },
    { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
    { path: 'menu/modifier', component: MenuModifierComponent, canActivate: [authGuard] },

    { path: 'cart', component: CartComponent, canActivate: [authGuard] },

    { path: '**', component: PageNotFoundComponent },
];
