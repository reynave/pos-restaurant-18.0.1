import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SocketService } from '../../../service/socket.service';
import { UserLoggerService } from '../../../service/user-logger.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-table-print-queue',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './table-print-queue.component.html',
  styleUrl: './table-print-queue.component.css',
})
export class TablePrintQueueComponent implements OnInit {
  @Input() data: string = ''; // Declare an input property
  items: any = [];
  cartId: string = '';
  loading: boolean = false;
  environment: any = environment;
  item: any;
  template : string = '';
  api: string = '';
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    private socketService: SocketService,
    public logService: UserLoggerService,
    private activatedRoute: ActivatedRoute,
    public modalService: NgbModal
  ) {}
  ngOnInit() { 
    this.api = this.configService.getApiUrl();

    console.log('messageFromParent:', this.data);
    this.cartId = this.data
      ? this.data
      : this.activatedRoute.snapshot.queryParams['cartId'];
    this.httpGet();
    this.socketService.listen<any>('printing').subscribe((msg) => {
      console.log(msg);
      let getIndexById = this.items.findIndex(
        (obj: { id: number }) => obj.id === msg['id']
      );

      if (getIndexById > -1) {
        this.items[getIndexById]['status'] = msg['status'];
        this.items[getIndexById]['statusName'] = msg['statusName'];
        this.items[getIndexById]['consoleError'] = msg['consoleError'];
      }
    });
  }

  httpGet() {
    this.loading = true;
    const url = this.api + 'printQueue/queue';
    this.http
      .get<any>(url, {
        headers: this.configService.headers(),
        params: {
          dailyCheckId: this.configService.getDailyCheck(),
          cartId: this.cartId,
        },
      })
      .subscribe(
        (data) => {
          this.loading = false;
          this.items = data['items'];
        },
        (error) => {
          console.log(error);
        }
      );
  }

  fnReprint(item: any) {
    this.loading = true;
    const url = this.api + 'printQueue/fnReprint';
    const body = {
      item: item,
    };
    this.http
      .post<any>(url, body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.loading = false;
          this.httpGet();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  itemDetail: any = {};
  openDetailModal(item: any, content: any) {
    this.item = item;
    try {
      this.itemDetail = JSON.parse(item.message);
    } catch (e) {
      this.itemDetail = item.message;
    }

    this.modalService.open(content);

    const url = this.api + 'printQueue/template';
    const body = {
      itemDetail: this.itemDetail,
      rushPrinting: item.rushPrinting
    };
    this.http
      .post<any>(url, body, {
        headers: this.configService.headers(),
        responseType: 'text' as 'json' // <-- tambahkan ini agar response berupa string (html)
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.template = data as string; // <-- assign html string ke this.template
        },
        (error) => {
          console.log(error);
        }
      );
  }

  fnRushPrint(item: any) {
    this.loading = true;
    const url = this.api + 'printQueue/fnRushPrint';
    const body = {
      item: item,
    };
    this.http
      .post<any>(url, body, {
        headers: this.configService.headers(),
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.modalService.dismissAll();
          this.loading = false;
          this.httpGet();
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
