import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

export class Actor {
  constructor(
    public outletTableMapId: number,
    public cover: number,
    public outletFloorPlandId: number,

  ) { }
}
@Component({
  selector: 'app-tables',
  standalone: true,
   imports: [HttpClientModule, CommonModule, FormsModule, NgbDropdownModule, RouterModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent implements OnInit {
  loading: boolean = false;
  current: number = 0;
  checkboxAll: number = 0;
  disabled: boolean = true;
  items: any = [{
    map: []
  }];
  outletSelect: any = [];
  api: string = environment.api;
  model = new Actor(0, 1, 0);
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
     private activeRouter: ActivatedRoute,
    
  ) { }


  ngOnInit() {

    this.modalService.dismissAll();
    this.httpGet(); 
  }
  httpGet() {
    this.loading = true;
    const url = environment.api + "tableMap";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.items = data['items'];
      },
      error => {
        console.log(error);
      }
    )
  }



  reload() {
    this.httpGet();
  }
  onMap(index: number) {
    console.log(index);
    this.current = index;
  }

  open(content: any, x: any) {
    this.model.cover = x.capacity
    this.model.outletTableMapId = x.id
    this.model.outletFloorPlandId = x.outletFloorPlandId

    this.modalService.open(content);
  }

  onSubmit() {
    console.log(this.model);

    const body = {
      model: this.model,
    }
    console.log(body);
    this.http.post<any>(environment.api + "tableMap/newOrder", body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/menu'], { queryParams: { id: data['cardId'] } });
        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }
}
