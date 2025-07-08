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
import { SocketService } from './../../service/socket.service';
import { UserLoggerService } from '../../service/user-logger.service';

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
  terminalId: any = localStorage.getItem("pos3.terminal.mitralink");
  getTokenJson: any = [];

  getConfigJson: any = [];
  dataHeader: any = {};
  public: string = environment.api + "../public/floorMap/";
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private socketService: SocketService,
    public logService: UserLoggerService

  ) { }


  ngOnInit() {
    this.current = 0;
    if (!localStorage.getItem("pos3.onMap")) {
      localStorage.setItem("pos3.onMap", '0')
    } else {
      this.current = parseInt(localStorage.getItem("pos3.onMap") || '0');
    }


    this.getConfigJson = this.configService.getConfigJson();
    this.getTokenJson = this.configService.getTokenJson();
    this.sendMessage();

    this.modalService.dismissAll();
    this.httpOutlet();
    this.httpGet();
    this.httpHeader();



    this.socketService.listen<string>('message-from-server').subscribe((msg) => {
      console.log(msg);
      this.httpGet();
    });



    //     this.current = localStorage.getItem("pos3.onMap");


  }
  sendMessage() {
    console.log("EMIT");
    this.socketService.emit('message-from-client', 'reload');
  }

  handleData(data: string) {

    if (this.model.cover == null) {
      this.model.cover = 0;
    }

    let cover = this.model.cover.toString();
    if (data == 'b') {
      cover = cover.slice(0, -1);
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
  totalCart: number = 99;
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
        this.loading = false;
        this.items = data['items'];
        this.totalCart = data['cart'].length;
      },
      error => {
        console.log(error);
      }
    )
  }

  reload() {
    this.httpGet();
    this.sendMessage()
  }

  onMap(index: number) {
    localStorage.setItem("pos3.onMap", index.toString());
    this.current = index;
  }

  open(content: any, x: any) {

    this.tableSelect = x;
    this.model.cover = x.capacity
    this.model.outletTableMapId = x.id
    this.model.outletFloorPlandId = x.outletFloorPlandId

    this.modalService.open(content, { size: 'sm' });
  }

  gotTo(x: any) {
    if (x.tableMapStatusId == '12') {
      this.router.navigate(['/menu'], { queryParams: { id: x.cardId } });
    }
    else if (x.tableMapStatusId == '18') {
      this.router.navigate(['/payment'], { queryParams: { id: x.cardId } });
    } else {
      this.router.navigate(['/menu'], { queryParams: { id: x.cardId } });
    }

  }

  modal(content: any) {
    this.modalService.open(content);
  }

  fnSelectOutlet(index: number) {
    this.getConfigJson['outlet']['id'] = this.outletSelect[index]['id'];
    this.getConfigJson['outlet']['name'] = this.outletSelect[index]['name'];

    this.configService.updateConfigJson(this.getConfigJson).subscribe(
      data => {
        if (data == true) {
          this.httpGet();
        }
      }
    )
  }

  onSubmit() {
    const outletId = this.configService.getConfigJson()['outlet']['id'];
    const body = {
      model: this.model,
      outletId: outletId,
      dailyCheckId: this.configService.getDailyCheck(),
    }
    this.http.post<any>(environment.api + "tableMap/newOrder", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
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
    this.configService.isLogoff();
    this.router.navigate(['/']);
  }

  signOff() {
    this.configService.removeToken().subscribe(
      () => {
        this.router.navigate(['login']);
      }
    )
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
        this.dataHeader = data['item'];
      },
      error => {
        console.log(error);
      }
    )
  }
  dailyClose() {

    this.http.get<any>(environment.api + "daily/checkItems", {
      headers: this.configService.headers()
    }).subscribe(
      data => {
        console.log(data);

        if (data['items'].length > 0) {
          alert("Please close " + data['items'].length + " tables!");
          this.logService.logAction('please close ' + data['items'].length + ' tables!')
        } else {
          this.modalService.open(DailyCloseComponent, { size: 'sm' });
          this.logService.logAction('Daily Close ?')
        }
      },
      error => {
        console.log(error);
      }
    )

  }

  selectActiveView(activeView: string) {
    this.activeView = activeView;

    localStorage.setItem("pos3.view", activeView);
  }
}
