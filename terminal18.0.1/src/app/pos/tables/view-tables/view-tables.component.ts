import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common'; 
import {   NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  RouterModule } from '@angular/router';
import { SocketService } from './../../../service/socket.service';
import { UserLoggerService } from '../../../service/user-logger.service';
export class Actor {
  constructor(
    public outletTableMapId: number,
    public cover: number,
    public outletFloorPlandId: number,

  ) { }
}
@Component({
  selector: 'app-view-tables',
  standalone: true,
   imports: [HttpClientModule, CommonModule,  RouterModule,],

  templateUrl: './view-tables.component.html',
  styleUrl: './view-tables.component.css'
})
export class ViewTablesComponent implements OnInit {
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
  terminalId: any = localStorage.getItem("pos3.terminal.mitralink");
  getTokenJson: any = [];
 
  getConfigJson: any = [];
  dataHeader: any = {};
  statusMap : any = [];
  public: string = environment.api + "../public/floorMap/";
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal, 
    private socketService: SocketService,
    public logService: UserLoggerService

  ) { }


  ngOnInit() {
    this.current = 0; 
    this.getConfigJson = this.configService.getConfigJson();
    this.getTokenJson = this.configService.getTokenJson();
    this.sendMessage();
    this.modalService.dismissAll();
    this.httpOutlet();
    this.httpGet(); 
    this.socketService.listen<string>('message-from-server').subscribe((msg) => {
      console.log(msg);
      this.httpGet();
    });

  }
  sendMessage() {
    console.log("EMIT");
    this.socketService.emit('message-from-client', 'reload');
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
        this.loading = false;
        this.items = data['items']; 
        this.statusMap = data['statusMap'];
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
    this.logService.logAction('Change Map ' + this.items[index]['desc1'])
    localStorage.setItem("pos3.onMap", index.toString());
    this.current = index;
  }
 

  fnSelectOutlet(index: number) {
    localStorage.setItem("pos3.onMap", "0");
    this.current = 0;
    this.getConfigJson['outlet']['id'] = this.outletSelect[index]['id'];
    this.getConfigJson['outlet']['name'] = this.outletSelect[index]['name'];

    this.configService.updateConfigJson(this.getConfigJson).subscribe(
      data => {
        if (data == true) { 
          this.httpGet();
          this.logService.logAction('Change Outlet to ' + this.outletSelect[index]['name'])
        }
      }
    )
  }
 
  
  
}
