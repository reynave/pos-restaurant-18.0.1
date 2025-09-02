import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../../../service/config.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merger-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merger-log.component.html',
  styleUrl: './merger-log.component.css'
})
export class MergerLogComponent implements OnInit {
  data  : any = [
    {items:[]}
  ];  
  activeModal = inject(NgbActiveModal);
  @Input() cartId: any;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.http.get<any>(this.configService.getApiUrl()+"menuItemPos/mergeLog",{
      headers : this.configService.headers(),
      params:{
        cartId : this.cartId
      }
    }).subscribe(
        data => { 
          console.log(data); 
          this.data  = data;
        },
        error => {
          console.log(error);
        }
      )
  }

}
