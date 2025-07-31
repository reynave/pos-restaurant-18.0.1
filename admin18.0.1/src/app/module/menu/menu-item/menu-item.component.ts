import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxCurrencyDirective } from "ngx-currency";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MenuItemDetailComponent } from './menu-item-detail/menu-item-detail.component';

export class Actor {
  constructor(
    public desc1: string,
    public date: number,
  ) { }
}
@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterLink, FormsModule, NgxCurrencyDirective],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css'
})
export class MenuItemComponent implements OnInit {
  loading: boolean = false;
  priceNumber: number = 1;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  selectCategory: any = [];
  selectClass: any = [];
  selectDept: any = [];
  departmentId: string = '';
  model = new Actor('', 0);
  menuTaxSc: any = [];
  discountGroup: any = [];
  modifierGroup: any = [];
  masterData: any = [];
  selectPrinter: any = [];
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.httpMaster();
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('Query Params changed:', params);
      this.departmentId = params['departmentId']
      this.httpMaster();
    });

  }
  httpMaster() {
    this.loading = true;
    const url = environment.api + "menu/master/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),

    }).subscribe(
      data => {
        console.log(data);
        this.httpGet();
        this.masterData = data;
        this.selectCategory = data['category'];
        this.selectClass = data['class'];
        this.selectDept = data['dept'];
        this.selectPrinter = data['printer'];

        this.menuTaxSc = data['menuTaxSc'];
        this.discountGroup = data['discountGroup'];
        this.modifierGroup = data['modifierGroup'];

        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }
  httpGet() {
    this.loading = true;
    const url = environment.api + "menu/item/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        departmentId: this.departmentId,
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
    this.sendInChunks(this.items, 30);
    // const url = environment.api + "menu/item/update";
    // const body = this.items;
    // this.http.post<any>(url, body, {
    //   headers: this.configService.headers(),
    // }).subscribe(
    //   data => {
    //     console.log(data);
    //     this.loading = false;
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // )
  }

  onDelete() {
    if (confirm("Delete this checklist?")) {
      this.loading = true;
      const url = environment.api + "menu/item/delete";
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
    const url = environment.api + "menu/item/create";
    const body = {
      model: this.model,
    };
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        if (data['error'] == false) {
          this.model = new Actor('', 0);
          this.httpGet();
        } else {
          alert("INSERT ERROR");
        }

      },
      error => {
        console.log(error);
      }
    )
  }

  open(content: any) {
    this.modalService.open(content);
  }


  onHere(x: any) {
    console.log(x);
  }


  sendInChunks(data: any[], chunkSize: number) {
    const url = environment.api + "menu/item/update";
    let currentIndex = 0;

    const sendNextChunk = () => {
      if (currentIndex >= data.length) {
        console.log('✅ All data was sent successfully.');
        this.loading = false;
        return;
      }

      const chunk = data.slice(currentIndex, currentIndex + chunkSize);
      this.http.post<any>(url, chunk, {
        headers: this.configService.headers(),
      }).subscribe({
        next: () => {
          console.log(`✅ Chunk send: ${currentIndex} - ${currentIndex + chunk.length - 1}`);
          currentIndex += chunkSize;
          sendNextChunk(); // Kirim berikutnya setelah sukses
        },
        error: (err) => {
          console.error(`❌ Failed to send chunk starting index ${currentIndex}:`, err);
        }
      });
    };

    sendNextChunk();
  }

  goToDetail(item: any, index: number) {
    const modalRef = this.modalService.open(MenuItemDetailComponent, { size: 'xl' });
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.masterData = this.masterData;

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Data dari child:', result);
          this.items[index]['name'] = result['item']['name'];
          this.items[index]['menuSet'] = result['item']['menuSet'];
          this.items[index]['discountGroupId'] = result['item']['discountGroupId'];
          this.items[index]['menuCategoryId'] = result['item']['menuCategoryId'];
          this.items[index]['menuClassId'] = result['item']['menuClassId'];
          this.items[index]['menuDepartmentId'] = result['item']['menuDepartmentId'];
          this.items[index]['menuTaxScId'] = result['item']['menuTaxScId'];
          this.items[index]['modifierGroupId'] = result['item']['modifierGroupId'];

          this.items[index]['price1'] = result['item']['price1'];
          this.items[index]['price2'] = result['item']['price2'];
          this.items[index]['price3'] = result['item']['price3'];
          this.items[index]['price4'] = result['item']['price4'];
          this.items[index]['price5'] = result['item']['price5'];

        }
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }
}
