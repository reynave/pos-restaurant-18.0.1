import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfigService } from '../../../service/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment.development';
import { UserLoggerService } from '../../../service/user-logger.service';

@Component({
  selector: 'app-transfer-items',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './transfer-items.component.html',
  styleUrl: './transfer-items.component.css'
})
export class TransferItemsComponent implements OnInit {
  table: any = [];
  id: string = '';
  items: any = [];
  subgroup: any = [];
  current: number = 0;
  loading: boolean = false;
  tablesMaps: any = []; 
  api: string = '';
  server: string = '';
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute,
    public logService: UserLoggerService

  ) { }
  ngOnInit(): void {

    this.api = this.configService.getApiUrl();
    this.server = this.configService.getServerUrl();


    this.id = this.activeRouter.snapshot.queryParams['id'];
    this.modalService.dismissAll();

    this.httpTables();
    this.current = 0;
    if (!localStorage.getItem("pos3.onMap")) {
      localStorage.setItem("pos3.onMap", '0')
    } else {
      this.current = parseInt(localStorage.getItem("pos3.onMap") || '0');
    }


    if (this.id == undefined) {
      alert("ERROR, ngOnInit() id == undefined ");
      this.router.navigate(['tables'])
    } else {
      this.httpGet();
    }
  }


  reload() {
    this.httpTables();
    this.httpGet();
  }

  httpGet() {
    this.http.get<any>(this.api + "menuItemPos/transferItems", {
      headers: this.configService.headers(),
      params: {
        id: this.id
      }
    }).subscribe(
      data => {
        console.log(data);
        this.items = data['items'];
        this.subgroup = data['subgroup'];
        this.table = data['table'];

      },
      error => {
        console.log(error)
      }
    )
  }
  onMap(index: number) {
    localStorage.setItem("pos3.onMap", index.toString());
    this.current = index;
  }

  httpTables() {
    this.modalService.dismissAll();
    this.loading = true;
    const url = this.api + "tableMap";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        outletId: this.configService.getConfigJson()['outlet']['id'],
      }
    }).subscribe(
      data => {
        this.loading = false;
        console.log('httpTables', data);
        this.tablesMaps = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }


  open(content: any) {
    this.modalService.open(content, { size: 'xl' })
  }

  fnTransferItems(table: any) {

    if (this.table['outletTableMapId'] == table.id) {
      alert("Select other table");
      this.logService.logAction('WARNING fnTransferItems - Select other table', this.id)
    } else {
      this.logService.logAction('fnTransferItems', this.id)


      const items: any[] = [];
      this.items.forEach((el: any) => {
        if (el.checkBox == 1) {
          items.push(el)
        }

      });
      console.log(table, items);

      const body = {
        cart: this.table,
        table: table,
        items: items,
        dailyCheckId: this.configService.getDailyCheck(),
        outletId: this.table['outletId'],
      }
      console.log(body);
      this.http.post<any>(this.api + "menuItemPos/transferTable", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.modalService.dismissAll();
          this.reload();
          this.logService.logAction('fnTransferItems Items table '+table.tableName+'('+table.id+') to '+items[0]['tableName']+'('+this.table['outletTableMapId']+')', this.id)
        },
        error => {
          console.log(error)
          this.logService.logAction('ERROR fnTransferItems', this.id)
        }
      )
    }

  }
}
