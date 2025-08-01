import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
export class Actor {
  constructor(
    public desc1: string,
    public value: string, 
    
  ) { }
}
@Component({
  selector: 'app-floor-map',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, NgbDatepickerModule],
  templateUrl: './floor-map.component.html',
  styleUrl: './floor-map.component.css'
})
export class FloorMapComponent  implements OnInit {
  loading: boolean = false;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [];
  outletSelect: any = []; 
  api: string = environment.api;
  id : string = "";
  model = new Actor('', '');
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
     private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
 
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('Query Params changed:', params);
      this.id = params['outletId']
      this.model.value =params['outletId'];
      this.httpMaster();
    });
  }
  httpMaster() {
    this.loading = true;
    const url = environment.api + "outlet/select/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
     
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.outletSelect = data['items']; 
        this.httpGet();
      },
      error => {
        console.log(error);
      }
    )
  }

  httpGet() {
    this.loading = true;
    const url = environment.api + "floorMap/map/";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
        params: {
        id: this.id,
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
    const url = environment.api + "floorMap/map/update";
    const body = this.items;
   
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  onDelete() {
    if (confirm("Delete this checklist?")) { 
      this.loading = true;
      const url = environment.api + "floorMap/map/delete";
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
    const url = environment.api + "floorMap/map/create";
    const body = {
      model: this.model,
    };
    this.http.post<any>(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        if (data['error'] == false) {
          this.model = new Actor('','');
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

}
