import { Component, OnInit } from '@angular/core';
import { HeaderMenuComponent } from "../../header/header-menu/header-menu.component";
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SocketService } from '../../service/socket.service';
import { UserLoggerService } from '../../service/user-logger.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-print-queue',
  standalone: true,
  imports: [HeaderMenuComponent, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './print-queue.component.html',
  styleUrl: './print-queue.component.css'
})
export class PrintQueueComponent implements OnInit {
  items: any = [];
  loading: boolean = false;
  environment: any = environment;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    private socketService: SocketService,
    public logService: UserLoggerService,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit() {
    this.httpGet();
    this.socketService.listen<any>('printing').subscribe((msg) => {
      console.log(msg);
      let getIndexById = this.items.findIndex((obj: { id: number; }) => (obj.id === msg['id']));

      if (getIndexById > -1) {
        this.items[getIndexById]['status'] = msg['status'];
        this.items[getIndexById]['statusName'] = msg['statusName'];
        this.items[getIndexById]['consoleError'] = msg['consoleError'];
      }  


    });
  }

  httpGet() {
    this.loading = true;
    const url = environment.api + "printQueue/queue";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        dailyCheckId: this.configService.getDailyCheck(),
        cartId : this.activatedRoute.snapshot.queryParams['cartId']
      }
    }).subscribe(
      data => {
        this.loading = false;
        this.items = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }

  fnReprint(item: any) {
    this.loading = true;
    const url = environment.api + "printQueue/fnReprint";
    const body = {
      item: item,
    }
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.httpGet();
      },
      error => {
        console.log(error);
      }
    )
  }
}
