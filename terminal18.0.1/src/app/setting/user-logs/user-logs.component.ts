import { Component } from '@angular/core';
import { HeaderMenuComponent } from "../../header/header-menu/header-menu.component";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-logs',
  standalone: true,
  imports: [HttpClientModule, CommonModule,FormsModule,  HeaderMenuComponent, NgbDatepickerModule,],

  templateUrl: './user-logs.component.html',
  styleUrl: './user-logs.component.css'
})
export class UserLogsComponent {

  date : any = [];
}
