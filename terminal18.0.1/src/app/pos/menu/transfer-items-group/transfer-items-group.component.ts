import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfigService } from '../../../service/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment.development';
import { UserLoggerService } from '../../../service/user-logger.service';
import { HeaderMenuComponent } from "../../../header/header-menu/header-menu.component";
import { KeyNumberComponent } from "../../../keypad/key-number/key-number.component";

@Component({
  selector: 'app-transfer-items-group',
  standalone: true,
  imports: [HeaderMenuComponent, HttpClientModule, CommonModule, FormsModule, RouterModule, KeyNumberComponent],
  templateUrl: './transfer-items-group.component.html',
  styleUrl: './transfer-items-group.component.css'
})
export class TransferItemsGroupComponent implements OnInit {
  table: any = [];
  id: string = '';
  item: any = {};
  items: any = [];
  itemsTransfer: any = [];
  subgroup: any = [];
  current: number = 0;
  loading: boolean = false;
  tablesMaps: any = [];
  qty: any = 0;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute,
    public logService: UserLoggerService

  ) { }
  ngOnInit(): void {
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
    this.http.get<any>(environment.api + "menuItemPos/transferItemsGroup", {
      headers: this.configService.headers(),
      params: {
        id: this.id
      }
    }).subscribe(
      data => {
        console.log(data);
        this.items = data['items'];
        let i = 1;
        this.items.forEach((element: any) => {
          element['id'] = i;
          i++;
        });
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
    const url = environment.api + "tableMap";
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


  open(content: any, size: string = 'xl') {
    this.modalService.open(content, { size: size })
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
        itemsTransfer: this.itemsTransfer,
        dailyCheckId: this.configService.getDailyCheck(),
        outletId: this.table['outletId'],
      }
      console.log(body);
     
      this.http.post<any>(environment.api + "menuItemPos/transferTable", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          this.itemsTransfer = [];
          console.log(data);
          this.modalService.dismissAll();
          this.reload();
          this.logService.logAction('fnTransferItems Items table ' + table.tableName + '(' + table.id + ') to ' + items[0]['tableName'] + '(' + this.table['outletTableMapId'] + ')', this.id)
        },
        error => {
          console.log(error)
          this.logService.logAction('ERROR fnTransferItems', this.id)
        }
      )
      
    }

  }

  handleData(data: any) {
    if (data == 'b') {
      let qty = this.qty.toString();
      qty = qty.slice(0, -1);

      if (qty == '') {
        qty = '0'
      }
      this.qty = parseInt(qty);


    } else {
      if (this.qty == 0) {
        this.qty = data;
      } else {
        this.qty = this.qty + data;
      }

      this.qty = parseInt(this.qty);
    }

  }

  indexNumber: number = 0;
  openKey(content: any, item: any, index: number) {
    this.qty = 0;
    this.item = item;
    this.indexNumber = index;
    console.log(this.item, this.indexNumber);
    this.modalService.open(content, { size: 'sm' })
  }


  onSubmit() {

    let total = 0;
    total = this.qty;

    if (this.qty > 0) {
      const targetId = this.items[this.indexNumber]['id'];
      const index = this.itemsTransfer.findIndex((item: { id: number; }) => item.id === targetId);
      console.log(index);
      if (index == -1) {

        if (this.items[this.indexNumber]['total'] < total) {
          total = this.items[this.indexNumber]['total'];
        }


        const data = {
          price: this.items[this.indexNumber]['price'],
          menuId: this.items[this.indexNumber]['menuId'],
          total: total,
          name: this.items[this.indexNumber]['name'],
          id: this.items[this.indexNumber]['id'],
        };
        this.itemsTransfer.push(data);


      } else {
        if (this.items[this.indexNumber]['total'] > 0) {

          if (this.items[this.indexNumber]['total'] < total) {
            this.itemsTransfer[index]['total'] = parseInt(this.itemsTransfer[index]['total']) + this.items[this.indexNumber]['total'];
          } else {
            this.itemsTransfer[index]['total'] = parseInt(this.itemsTransfer[index]['total']) + total;
          }
        }
      }
      // ITEMS  
      if (this.items[this.indexNumber]['total'] - parseInt(this.qty) < 0) {
        this.items[this.indexNumber]['total'] = 0;
      } else {
        this.items[this.indexNumber]['total'] = this.items[this.indexNumber]['total'] - parseInt(this.qty);
      }
      // this.qty = 0;
      // this.modalService.dismissAll();


    }
    this.modalService.dismissAll();
  }

  fnCancel(index: number) {

    const targetId = 3;
    const itemIndex = this.items.findIndex((item: { id: number; }) => item.id ===  this.itemsTransfer[index]['id']);
    console.log('itemIndex', itemIndex);
    if (itemIndex !== -1) {
      this.items[itemIndex]['total'] =  this.items[itemIndex]['totalReset'] ;
    }

    console.log(index);
    this.itemsTransfer.splice(index, 1);

    
  }
}

