import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { KeyNumberComponent } from "../../keypad/key-number/key-number.component";
import { DailyCloseComponent } from '../daily/daily-close/daily-close.component';
import { HeaderMenuComponent } from "../../header/header-menu/header-menu.component";
export class Actor {
  constructor(
    public outletTableMapId: number,
    public cover: number,
    public outletFloorPlandId: number,

  ) { }
}
@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule, KeyNumberComponent, HeaderMenuComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent implements OnInit {
  loading: boolean = false;
  current: number = 0;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [{
    map: []
  }];
  tableSelect: any = [];
  outletSelect: any = [];
  api: string = environment.api;
  model = new Actor(0, 1, 0);
  activeView: string = localStorage.getItem("pos3.view") ?? 'map';
  getConfigJson: any = [];
  dataHeader: any = {};
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute,

  ) { }


  ngOnInit() {
    this.getConfigJson = this.configService.getConfigJson();

    console.log(this.getConfigJson);
    this.modalService.dismissAll();
    this.httpOutlet();
    this.httpGet();
    this.httpHeader();
  }


  handleData(data: string) {

    let cover = this.model.cover.toString();
    if (data == 'b') {
      cover = cover.slice(0, -1);
      console.log(data)
    } else {
      cover = cover + data;
    }
    this.model.cover = parseInt(cover || '0'); // fallback kalau cover kosong

  }

  httpOutlet() {
    this.loading = true;
    const url = environment.api + "login/outlet";
    this.http.get<any>(url).subscribe(
      data => {
        this.loading = false;
        this.outletSelect = data['outletSelect'];
      },
      error => {
        console.log(error);
      }
    )
  }

  httpGet() {
    this.modalService.dismissAll();
    this.loading = true;
    const url = environment.api + "tableMap";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        outletId: this.getConfigJson['outlet']['id'],
      }
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.items = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }

  reload() {
    this.httpGet();
  }

  onMap(index: number) {
    console.log(index);
    this.current = index;
  }

  open(content: any, x: any) {

    this.tableSelect = x;
    this.model.cover = x.capacity
    this.model.outletTableMapId = x.id
    this.model.outletFloorPlandId = x.outletFloorPlandId

    this.modalService.open(content, { size: 'sm' });
  }

  gotTo(url: string, params: any) {
    this.router.navigate([url], { queryParams: params });
  }

  modal(content: any) {
    this.modalService.open(content);
  }

  fnSelectOutlet(index: number) {
    this.getConfigJson['outlet']['id'] = this.outletSelect[index]['id'];
    this.getConfigJson['outlet']['name'] = this.outletSelect[index]['name'];

    console.log(this.getConfigJson);
    this.configService.updateConfigJson(this.getConfigJson).subscribe(
      data => {
        console.log(data);
        if (data == true) {
          this.httpGet();
        }
      }
    )
  }

  onSubmit() {
    console.log(this.model);
    const outletId = this.configService.getConfigJson()['outlet']['id'];
    const body = {
      model: this.model,
      outletId: outletId,
      dailyCheckId: this.configService.getDailyCheck(),
    }
    console.log(body);
    this.http.post<any>(environment.api + "tableMap/newOrder", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        if (data['error'] != true) {
          this.router.navigate(['/menu'], { queryParams: { id: data['cardId'] } });
          this.modalService.dismissAll();
        } else {
          alert("Table Used");
          this.reload();
        }

      },
      error => {
        console.log(error);
      }
    )
  }

  logOff() {
    this.router.navigate(['/']);
  }

  signOff() {
    this.configService.removeToken().subscribe(
      () => {
        this.router.navigate(['login']);
      }
    )
  }

  dailyClose() {
    let checking = 0;

    for (let i = 0; i < this.items.length; i++) {
      checking += this.items[i]['checking'];
      if (checking > 0) {
        i = this.items.length * 2;
      }
    }
    if (checking > 0) {
      alert("please close all tables!")
    } else {
      this.modalService.open(DailyCloseComponent, { size: 'sm' });

    }


  }

  httpHeader() {
    let id = this.configService.getDailyCheck();
    const url = environment.api + "daily/getDailyStart";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        id: id,
      }
    }).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        this.dataHeader = data['item'];
      },
      error => {
        console.log(error);
      }
    )
  }


  selectActiveView(activeView : string){
    this.activeView = activeView;

    localStorage.setItem("pos3.view",activeView);
  }
}
