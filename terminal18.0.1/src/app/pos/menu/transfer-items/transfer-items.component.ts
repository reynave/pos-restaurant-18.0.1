import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfigService } from '../../../service/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-transfer-items',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './transfer-items.component.html',
  styleUrl: './transfer-items.component.css'
})
export class TransferItemsComponent implements OnInit {
  tables: any = [];
  id: string = '';
  items: any = [];
  subgroup: any = [];
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute,

  ) { }
  ngOnInit(): void {
    this.id = this.activeRouter.snapshot.queryParams['id'],
      this.modalService.dismissAll();

    if (this.id == undefined) {
      alert("ERROR, ngOnInit() id == undefined ");
      this.router.navigate(['tables'])
    } else {
      this.httpGet();
    }
  }

  httpGet() {
    this.http.get<any>(environment.api + "menuItemPos/transferItems", {
      headers: this.configService.headers(),
      params: {
        id: this.id
      }
    }).subscribe(
      data => {
        console.log(data);
        this.items = data['items'];
        this.subgroup = data['subgroup'];
        this.tables = data['tables'];

      },
      error => {
        console.log(error)
      }
    )
  }


  updateGroup(item: any, a: string, i: number) {
    console.log(item.id, a, i)
    this.items[i]['subgroup'] = a;

    const body = {
      id: item.id,
      group: a
    }
    this.http.post<any>(environment.api + "bill/updateGroup", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error)
      }
    )
  }

  open(content: any) {
    this.modalService.open(content, { size: 'xl' })
  }

  fnTransferItems(table: any) {
    const items: any[] = [];
    this.items.forEach((el: any) => {
      if (el.checkBox == 1) {
        items.push(el)
      }

    });
    console.log(table, items)
  }
}
