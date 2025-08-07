import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    RouterLink,
    FormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
  ],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css',
})
export class TransactionDetailComponent implements OnInit {
  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  id: string = '';
  header: any = {};
  sc: any = [];
  tax: any = [];
  discount: any = [];
  modifier: any = [];

  showModifier: boolean = false;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.queryParams['id'];
    this.httpGet();
  }
  back() {
    history.back();
  }
  httpGet() {
    this.loading = true;
    const url = environment.api + 'transaction/detail';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          id: this.id,
        },
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loading = false;
          this.items = data['cartItem'];
          this.header = data['header'];

          this.discount = data['discount'];
          this.sc = data['sc'];
          this.tax = data['tax'];
          this.modifier = data['modifier'];

          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
