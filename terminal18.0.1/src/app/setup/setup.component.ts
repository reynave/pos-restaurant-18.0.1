import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '../service/config.service';
@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css',
})
export class SetupComponent implements OnInit {
  env: any = environment;
  loading: boolean = false;
  error: boolean = false;
  response: any = [];
  http = inject(HttpClient);

  api: string = '';
  server: string = '';
  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.loading = true;
    console.log(
      this.configService.getApiUrl(),
      this.configService.getServerUrl()
    );

    this.api = this.configService.getApiUrl();
    this.server = this.configService.getServerUrl();
  }

  testConnection() {

    // Pastikan api dan server diakhiri dengan "/"
    if (!this.api.endsWith('/')) {
      this.api += '/';
    }
    if (!this.server.endsWith('/')) {
      this.server += '/';
    }

    localStorage.setItem('pos3.env.api', this.api);
    localStorage.setItem('pos3.env.server', this.server);

    this.loading = true;
    this.error = false;
    this.http.get<any>(this.server + 'checkdb').subscribe({
      next: (response) => {
        this.error = false;
        this.response = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = true;
        console.error('Connection failed:', error);
        this.response = error;
        this.loading = false;
      },
    });
  }
  ngAfterViewInit(): void {
    this.loading = false;
    this.testConnection();
  }
}
