import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../../../service/config.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transfer-log.component.html',
  styleUrl: './transfer-log.component.css'
})
export class TransferLogComponent implements OnInit {
  transferOut : any = [];
  transferIn : any = [];
  
  activeModal = inject(NgbActiveModal);
  @Input() cartId: any;
  constructor(
    public configService: ConfigService,
    private http: HttpClient,
  ) { }
  ngOnInit(): void {
    this.http.get<any>(this.configService.getApiUrl()+"menuItemPos/transferLog",{
      headers : this.configService.headers(),
      params:{
        cartId : this.cartId
      }
    }).subscribe(
        data => { 
          console.log(data);
          this.transferOut = data['transferOut'];
          this.transferIn = data['transferIn'];
        },
        error => {
          console.log(error);
        }
      )
  }

}
