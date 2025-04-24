import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmployeeComponent } from './module/employee/employee.component';
import { OutletComponent } from './module/outlet/outlet.component'; 

export const routes: Routes = [
    { path: '',component: HomeComponent},
    { path: 'home', component: HomeComponent },
    { path: 'employee', component: EmployeeComponent },
    { path: 'outlet', component: OutletComponent },

     
    
    { path: '**', component: PageNotFoundComponent },
];
