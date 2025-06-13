import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import {  NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css'
})
export class HeaderMenuComponent implements OnInit, OnDestroy {
back() {
 history.back();
}
  dataHeader: any = {};
  loading: boolean = false;

  currentTime: Date = new Date();
  private intervalId: any;

  path : any = '';
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public offcanvasService: NgbOffcanvas,
    private router: Router,
    private activeRouter: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.path = this.activeRouter.snapshot.routeConfig?.path;
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000); // update setiap 1 detik 
  }
 
	openEnd(content: any) {
		this.offcanvasService.open(content, { position: 'end' });
	}

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
