import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxCurrencyDirective } from "ngx-currency";

export class Actor {
  constructor(
    public desc1: string,
    public date: number,
  ) { }
}

@Component({
  selector: 'app-menu-lookup',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, NgbDatepickerModule, NgxCurrencyDirective],

  templateUrl: './menu-lookup.component.html',
  styleUrl: './menu-lookup.component.css'
})
export class MenuLookupComponent implements OnInit {

  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  lookupItems: any = [];

  selectCategory: any = [];
  selectClass: any = [];
  selectDept: any = [];

  model = new Actor('', 0);
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    // this.httpMaster();
    this.httpGet();

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
        this.selectCategory = data['category'];
        this.selectClass = data['class'];
        this.selectDept = data['dept'];
        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }
  httpGet() {
    this.loading = true;
    const url = environment.api + "menu/menuLookup/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.lookupItems = data['results'];
        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }


  // Map ID => isExpanded
  expandedMap: { [id: number]: boolean } = {};

  toggleExpand(id: number) {
    this.expandedMap[id] = !this.expandedMap[id];
  }

  isExpanded(id: number): boolean {
    return this.expandedMap[id] ?? true; // default expanded
  }

  menuRow(x: any) {
    this.loading = true;
    const url = environment.api + "menu/menuLookup/items";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        menuLookupId: x.id,
      }
    }).subscribe(
      data => {
        this.loading = false;
        this.items = data['items'];
        console.log(data);
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )
  }
removeLookup() {  
  const s: any[] = [];

  this.items.forEach((el: any) => {
      if(el.checkBox == 1){
        s.push(el.id);
      }
  });
  console.log(s);
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
}

