import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
export class Actor {
  constructor(
    public name: string,
    public icon: string,
    public height: number,
    public width: number,
    public capacity: number,

  ) { }
}
@Component({
  selector: 'app-daily-schedule',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, NgbDatepickerModule],
  templateUrl: './daily-schedule.component.html',
  styleUrl: './daily-schedule.component.css'
})
export class DailyScheduleComponent implements OnInit {
  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  outletSelect: any = [];
  api: string = environment.api;
  id: string = "";
  model = new Actor('', '', 80, 80, 1);
  path: string = environment.api + "public/floorMap/icon/";

  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.httpGet();
  }



  httpGet() {
    this.loading = true;
    const url = environment.api + "dailySchedule";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: this.id,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.items = data['items'];
        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }

  checkAll() {
    if (this.checkboxAll == 0) {
      this.checkboxAll = 1;
      for (let i = 0; i < this.items.length; i++) {
        this.items[i]['checkbox'] = 1;
      }
    }
    else if (this.checkboxAll == 1) {
      this.checkboxAll = 0;
      for (let i = 0; i < this.items.length; i++) {
        this.items[i]['checkbox'] = 0;
      }
    }
  }

  cancel() {
    this.disabled = true;
    this.httpGet();
  }

  onUpdate() {
    this.loading = true;
    const url = environment.api + "dailySchedule/update";
    const body = this.items;

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

  onDelete() {
    if (confirm("Delete this checklist?")) {
      this.loading = true;
      const url = environment.api + "dailySchedule/delete";
      const body = this.items;
      this.http.post<any>(url, body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.httpGet();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  onSubmit() {
    this.loading = true;
    const url = environment.api + "dailySchedule/create";
    const body = {
      model: this.model,
    };
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.modalService.dismissAll();
        this.model.name = '';

        this.httpGet();


      },
      error => {
        console.log(error);
      }
    )
  }
  item: any = {}
  open(content: any, item: any = [], size: string = 'md') {
    this.item = item;
    this.modalService.open(content, { size: size });
    this.httpGetImg();

  }
  selectImg: any = [];
  httpGetImg() {
    const url = environment.api + "tableMap/table/icon";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.selectImg = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }

  updateImg(filename: string) {
    const url = environment.api + "dailySchedule/updateImg";
    const body = {
      filename: filename,
      item: this.item
    }
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.modalService.dismissAll()
        this.httpGet();
      },
      error => {
        console.log(error);
      }
    )
  }
}
