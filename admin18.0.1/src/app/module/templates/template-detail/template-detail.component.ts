import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [HttpClientModule, RouterLink, CommonModule, FormsModule, NgbDropdownModule, NgbDatepickerModule],
  templateUrl: './template-detail.component.html',
  styleUrl: './template-detail.component.css'
})
export class TemplateDetailComponent implements OnInit {
  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  id: string = '';
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    public activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.queryParams['id'];
    this.httpGet();
  }

  httpGet() {
    this.loading = true;
    const url = environment.api + "template/detail";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.id
      }
    }).subscribe(
      data => {
        this.items = data;
        this.loading = false;
        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }

  cancel() {
    this.disabled = true;
    this.httpGet();
  }
  onUpdate() {
    this.loading = true;
    const url = environment.api + "template/update";
    const body = {
      id : this.items.id,
      message : this.toBase64Unicode(this.items.message),
    };
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  toBase64Unicode(str: string): string {
    str = str.replace(/'/g, "\\'").replace(/"/g, '\\"');
    return btoa(unescape(encodeURIComponent(str)));
  }

  back() {
    history.back();
  }
  open(content: any) {
    this.modalService.open(content);
  }

}
