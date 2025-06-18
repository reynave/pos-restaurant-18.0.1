import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderMenuComponent } from "../header/header-menu/header-menu.component";

@Component({
  selector: 'app-setting',
  standalone: true,
   imports: [CommonModule, FormsModule, RouterModule, HeaderMenuComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {
  config : any = []
   constructor(
      public configService: ConfigService,  
    ) { }
  ngOnInit(): void {
    this.config = this.configService.getConfigJson();
  }
  back(){
    history.back();
  }
  
  
}
