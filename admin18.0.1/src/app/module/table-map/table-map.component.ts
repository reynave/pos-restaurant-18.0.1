import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import interact from 'interactjs';
import { environment } from '../../../environments/environment';
import { ConfigService } from '../../service/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
export class Actor {
  constructor(
    public outletFloorPlandId: number,
    public tableName: string,
    public totalTable: number,
    
    public templateTableId: string,
  ) { }
}
@Component({
  selector: 'app-table-map',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule,RouterModule ],
  templateUrl: './table-map.component.html',
  styleUrl: './table-map.component.css'
})
export class TableMapComponent implements OnInit, AfterViewInit {
  resp: string = '';
  path : string = environment.api+"public/floorMap/";
  loading: boolean = false;
  editable: boolean = false;
  outletFloorPlandId: number = 0;
  @ViewChildren('tableEl') tableElements!: QueryList<ElementRef>;
  items: any = [];
  floorPlan: any = [];
  model: any = new Actor(1, "",1, '');
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    public modalService: NgbModal,
    /// private activatedRoute: ActivatedRoute,
  ) { }
  // tables = [
  //   { id: 1, name: 'Table A', x: 100, y: 50, width: 100, height: 80, icon: 'assets/table-a.png' },
  //   { id: 2, name: 'Table B', x: 300, y: 150, width: 120, height: 90, icon: 'assets/table-b.png' },
  //   { id: 3, name: 'Table C', x: 200, y: 250, width: 110, height: 100, icon: 'assets/table-c.png' }
  // ];
  tables: any = [];
  tablesTemp: any = [];
  templateTableMap: any = [];

  ngOnInit(): void {
    //  this.httpGet();
    this.httpMaster();

  }

  activeFloor(x: any) {

    if(this.editable){
      if(confirm("Close unsaved editable ?")){
        this.outletFloorPlandId = x.id;
        this.model.outletFloorPlandId = x.id;
        if (this.outletFloorPlandId !== 0) {
          this.httpGet();
        }
      }
    }else{
      this.outletFloorPlandId = x.id;
      this.model.outletFloorPlandId = x.id;
      if (this.outletFloorPlandId !== 0) {
        this.httpGet();
      }
    }
  
  }
  httpMaster() {
    this.loading = true;
    const url = environment.api + "tableMap/table/master";
    this.http.get<any>(url, {
      headers: this.configService.headers(),

    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.floorPlan = data['floorPlan'];
        this.templateTableMap = data['templateTableMap']
        this.modalService.dismissAll();
      },
      error => {
        console.log(error);
      }
    )
  }
  httpGet() {
    this.editable = false;
    this.loading = true;
    const url = environment.api + "tableMap/table";
    this.http.get<any>(url, {
      headers: this.configService.headers(),
      params: {
        outletFloorPlandId: this.outletFloorPlandId,
      }
    }).subscribe(
      data => {
        console.log(data);
        this.loading = false;
        this.items = data['items'];
        this.modalService.dismissAll();

        this.tables = [];

        for (let i = 0; i < this.items.length; i++) {

          this.tables.push(
            {
              id: this.items[i]['id'],
              tableName: this.items[i]['tableName'],
              capacity: this.items[i]['capacity'],
              x: this.items[i]['posX'],
              y: this.items[i]['posY'],
              width: this.items[i]['width'],
              height: this.items[i]['height'],
              icon: 'assets/table-a.png'
            },
          );
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  onEditable() {
    this.editable = !this.editable;
    this.resp = '';
    // const newTable =
    //   { id: 12, name: 'Table 1212', x: 300, y: 150, width: 400, height: 80, icon: 'assets/table-a.png' };


    // this.tables.push(newTable)
    // Re-bind interact to new elements
    setTimeout(() => {
      this.initializeInteract();
    });
  }

  onSave() {

    console.log(this.tables);
    const body = {
      tables: this.tablesTemp,
      tablesName: this.tables,
    }
    this.http.post<any>(environment.api + "tableMap/table/postUpdatePosXY", body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.resp = 'Save';
      },
      error => {
        console.log(error)
      }
    )

  }

  initializeInteract() {
    const isLocked = this.editable;

    if (isLocked) {
      interact('.draggable').draggable(false).resizable(false);
    } else {
      interact('.draggable').draggable({ /* opsi */ }).resizable({ /* opsi */ });
    }

    const self: any = this;
    this.tableElements.forEach((elRef, index) => {
      const el = elRef.nativeElement;
      const table = this.tables[index];

      el.setAttribute('data-x', table.x.toString());
      el.setAttribute('data-y', table.y.toString());

      interact(el)
        .draggable({
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: '#contentDiv', // atau pakai selektor: '#contentDiv'
              endOnly: true
            })
          ],
          listeners: {
            move(event) {
              const target = event.target;
              const id = target.getAttribute('data-id');
              let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
              let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

              target.style.transform = `translate(${x}px, ${y}px)`;
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);
            },
            end(event) {
              const target = event.target;
              const id = parseInt(target.getAttribute('data-id'), 10);
              const x = parseFloat(target.getAttribute('data-x')) || 0;
              const y = parseFloat(target.getAttribute('data-y')) || 0;

              console.log('Moved:', { id, x, y });

              const updates = {
                id: id,
                x: Number(x.toFixed(1)),
                y: Number(y.toFixed(1)),
              }

              const index = self.tablesTemp.findIndex((table: any) => table.id === id);
              if (index !== -1) {
                const updates = {
                  x: Number(x.toFixed(1)),
                  y: Number(y.toFixed(1)),
                }
                self.tablesTemp[index] = {
                  ...self.tablesTemp[index],
                  ...updates
                };
              } else {
                self.tablesTemp.push(updates)
              }
              console.log(self.tablesTemp);
              // TODO: Send new position to server here
            }
          }
        })
      // .resizable({
      //   edges: { left: true, right: true, bottom: true, top: true },
      //   modifiers: [
      //     interact.modifiers.restrictEdges({
      //       outer: 'parent', // Batas resize di dalam #contentDiv
      //       endOnly: true
      //     }),
      //     interact.modifiers.restrictSize({
      //       min: { width: 80, height: 80 } // Ukuran minimal 100x100
      //     })
      //   ],
      //   listeners: {
      //     move(event) {
      //       const target = event.target;
      //       let x = parseFloat(target.getAttribute('data-x')) || 0;
      //       let y = parseFloat(target.getAttribute('data-y')) || 0;

      //       target.style.width = `${event.rect.width}px`;
      //       target.style.height = `${event.rect.height}px`;

      //       x += event.deltaRect.left;
      //       y += event.deltaRect.top;

      //       target.style.transform = `translate(${x}px, ${y}px)`;
      //       target.setAttribute('data-x', x);
      //       target.setAttribute('data-y', y);
      //     },
      //     end(event) {
      //       const target = event.target;
      //       const id = parseInt(target.getAttribute('data-id'), 10);
      //       const width = event.rect.width;
      //       const height = event.rect.height;
      //       const x = parseFloat(target.getAttribute('data-x')) || 0;
      //       const y = parseFloat(target.getAttribute('data-y')) || 0;

      //       console.log('Resized:', { id, x, y, width, height });
      //       // TODO: Send resize info to server here
      //     }
      //   }
      // });
    });
  }

  ngAfterViewInit(): void {
    this.initializeInteract();
  }



  onDelete(index: number) {
    console.log(index);
    if (confirm("Delete this tables ?")) {
      const body = this.tables[index];

      // console.log(body);
      this.http.post<any>(environment.api + "tableMap/table/delete", body, {
        headers: this.configService.headers(),
      }).subscribe(
        data => {
          console.log(data);
          this.resp = 'Save';
          this.tables.splice(index, 1);
          setTimeout(() => {
            this.initializeInteract();
          });
        },
        error => {
          console.log(error);
        },
      )



    }


  }


  open(content: any) { 
    this.modalService.open(content)
  }

  onSubmit(){
    console.log(this.model);

    const body = {
      model: this.model, 
    }
    this.http.post<any>(environment.api + "tableMap/table/create", body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.resp = 'Save';
        this.modalService.dismissAll();
        this.httpGet();
      },
      error => {
        console.log(error)
      }
    )
  }

}
