import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { KeyNumberComponent } from '../../keypad/key-number/key-number.component';
import { DailyCloseComponent } from '../daily/daily-close/daily-close.component';
import { HeaderMenuComponent } from '../../header/header-menu/header-menu.component';
import { SocketService } from './../../service/socket.service';
import { UserLoggerService } from '../../service/user-logger.service';
import { param } from 'jquery';

export class Actor {
  constructor(
    public outletTableMapId: number,
    public cover: number,
    public outletFloorPlandId: number
  ) {}
}
@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    RouterModule,
    KeyNumberComponent,
    HeaderMenuComponent,
  ],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent implements OnInit {
  loading: boolean = false;
  lock: boolean = true;
  current: number = 0;
  checkboxAll: number = 0;
  statusMap: any = [];
  disabled: boolean = true;
  items: any = [
    {
      map: [],
    },
  ];
  screenWidth: number = window.innerWidth;
  tableSelect: any = [];
  outletSelect: any = [];
  api: string = environment.api;
  model = new Actor(0, 1, 0);
  activeView: string = localStorage.getItem('pos3.view') ?? 'map';
  terminalId: any = localStorage.getItem('pos3.terminal.mitralink');
  getTokenJson: any = [];
  zoom: number = parseInt(localStorage.getItem('pos3.zoom') || '100');
  getConfigJson: any = [];
  dataDailyStart: any = {};
  public: string = environment.api + '../public/floorMap/';
  private intervalId: any;
  currentTime: Date = new Date();
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private socketService: SocketService,
    public logService: UserLoggerService
  ) {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000); // update setiap 1 detik

    this.current = 0;
    if (!localStorage.getItem('pos3.onMap')) {
      localStorage.setItem('pos3.onMap', '0');
    } else {
      this.current = parseInt(localStorage.getItem('pos3.onMap') || '0');
    }
    this.getConfigJson = this.configService.getConfigJson();
    this.getTokenJson = this.configService.getTokenJson();
    this.sendMessage();
    this.modalService.dismissAll();
    this.httpOutlet();
    this.httpGet();
    this.httpDailyStart();
    this.socketService
      .listen<string>('message-from-server')
      .subscribe((msg) => {
        this.httpGet();
      });
  }
  sendMessage() {
    console.log('EMIT');
    this.socketService.emit('message-from-client', 'reload');
  }
  onZoomChange() {
    console.log(this.zoom);
    localStorage.setItem('pos3.zoom', this.zoom.toString());
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
    const url = environment.api + 'login/outlet';
    this.http.get<any>(url).subscribe(
      (data) => {
        this.loading = false;
        this.outletSelect = data['outletSelect'];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  totalCart: number = 99;
  httpGet() {
    this.modalService.dismissAll();
    this.loading = true;
    const url = environment.api + 'tableMap';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          outletId: this.getConfigJson['outlet']['id'],
        },
      })
      .subscribe(
        (data) => {
          this.loading = false;
          this.items = data['items'];
          this.totalCart = data['cart'].length;
          this.statusMap = data['statusMap'];
        },
        (error) => {
          console.log(error);
        }
      );
  }

  reload() {
    this.httpGet();
    this.sendMessage();
  }

  onMap(index: number) {
    this.logService.logAction('Change Map ' + this.items[index]['desc1']);
    localStorage.setItem('pos3.onMap', index.toString());
    this.current = index;
  }
  currentTable: number = 0;
  item: any = [];
  open(content: any, x: any, current: number, i: number) {
    if (this.items[current]['maps'][i]['active'] == 1) {
      if (x.cover <= 0 || x.cover == '') {
        this.logService.logAction('Select Table ' + x.tableName);
        this.tableSelect = x;
        this.model.cover = x.capacity;
        this.model.outletTableMapId = x.id;
        this.model.outletFloorPlandId = x.outletFloorPlandId;

        if (this.lock == false) {
          this.modalService.open(content, { size: 'sm' });
        } else {
          alert('Daily Close Requirement!');
        }
      } else {
        this.gotTo(x);
      }
    }

    //  console.log(x.id, x, current, i);
    this.currentTable = x;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i]['maps'].forEach((row: any) => {
        row['active'] = 0;
      });
    }

    this.items[current]['maps'][i]['active'] = 1;
    console.log(this.items[current]['maps'][i]);
    this.item = this.items[current]['maps'][i];
    this.item['indexed'] = {
      current: current,
      i: i,
    };
    this.http
      .get<any>(environment.api + 'tableMap/detail', {
        headers: this.configService.headers(),
        params: {
          cartId: this.item.cardId,
        },
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.item['detail'] = data['detail'];
          this.item['cart'] = data['cart'];
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onRemoveCurrentTable() {
    this.currentTable = 0;
    this.items[this.item.indexed.current]['maps'][this.item.indexed.i][
      'active'
    ] = 0;
  }
  gotTo(x: any) {
    if (x.tableMapStatusId == '12') {
      this.router.navigate(['/menu'], { queryParams: { id: x.cardId } });
      this.logService.logAction('Go to Menu', x.cardId);
    } else if (x.tableMapStatusId == '18') {
      this.router.navigate(['/payment'], { queryParams: { id: x.cardId } });
      this.logService.logAction('Go to payment', x.cardId);
    } else {
      this.router.navigate(['/menu'], { queryParams: { id: x.cardId } });
      this.logService.logAction('Go to Menu', x.cardId);
    }
  }

  modal(content: any) {
    this.modalService.open(content);
  }

  fnSelectOutlet(index: number) {
    localStorage.setItem('pos3.onMap', '0');
    this.current = 0;
    this.getConfigJson['outlet']['id'] = this.outletSelect[index]['id'];
    this.getConfigJson['outlet']['name'] = this.outletSelect[index]['name'];

    this.configService
      .updateConfigJson(this.getConfigJson)
      .subscribe((data) => {
        if (data == true) {
          this.httpGet();
          this.logService.logAction(
            'Change Outlet to ' + this.outletSelect[index]['name']
          );
        }
      });
  }

  onSubmit() {
    const outletId = this.configService.getConfigJson()['outlet']['id'];

    this.logService.logAction(
      'New Order ' +
        this.configService.getConfigJson()['outlet']['name'] +
        '(' +
        this.configService.getConfigJson()['outlet']['id'] +
        ') Cover : ' +
        this.model['cover'] +
        ', Table : ' +
        this.tableSelect.tableName +
        '(' +
        this.model['outletTableMapId'] +
        ')'
    );
    const body = {
      model: this.model,
      outletId: outletId,
      dailyCheckId: this.configService.getDailyCheck(),
    };
    this.http
      .post<any>(environment.api + 'tableMap/newOrder', body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          if (data['error'] != true) {
            this.router.navigate(['/menu'], {
              queryParams: { id: data['cardId'] },
            });
            this.modalService.dismissAll();
            this.logService.logAction('Go to Menu', data['cardId']);
            this.socketService.emit('message-from-client', 'reload');
          } else {
            alert('Table Used');
            this.logService.logAction('ERROR Table Used');
            this.reload();
          }
        },
        (error) => {
          console.log(error);
          this.logService.logAction('ERROR now order');
        }
      );
  }

  logOff() {
    this.configService.isLogoff();
    this.router.navigate(['/home']);
    this.logService.logAction('Log Off');
  }

  signOff() {
    this.configService.removeToken().subscribe(() => {
      this.router.navigate(['login']);
      this.logService.logAction('Sign Off');
    });
  }

  httpDailyStart() {
    let id = this.configService.getDailyCheck();
    const url = environment.api + 'daily/getDailyStart';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          id: id,
        },
      })
      .subscribe(
        (data) => {
          this.loading = false;
          this.dataDailyStart = data['item'];

          if (this.dataDailyStart['closeDateWarning'] > 0) {
            this.lock = false;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  dailyClose() {
    this.logService.logAction('Click Daily Close');
    this.http
      .get<any>(environment.api + 'daily/checkItems', {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);

          if (data['items'].length > 0) {
            this.logService.logAction(
              'Daily Close ' +
                'Please close ' +
                data['items'].length +
                ' tables!'
            );
            alert('Please close ' + data['items'].length + ' tables!');
          } else {
            this.modalService.open(DailyCloseComponent, { size: 'sm' });
            this.logService.logAction('Confirm Daily Close');
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  selectActiveView(activeView: string) {
    this.activeView = activeView;
    this.logService.logAction('Change View to ' + activeView);
    localStorage.setItem('pos3.view', activeView);
  }

  getHourMinute(minutes: number): string {
    const total = Math.abs(minutes);
    const hour = Math.floor(total / 60);
    const min = total % 60;
    return `${hour}:${min < 10 ? '0' : ''}${min}`;
  }
}
