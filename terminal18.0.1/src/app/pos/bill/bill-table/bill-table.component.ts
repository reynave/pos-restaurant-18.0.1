import { Component, Input  } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
 
@Component({
  selector: 'app-bill-table',
  standalone: true,
 imports: [  CommonModule],
  templateUrl: './bill-table.component.html',
  styleUrl: './bill-table.component.css'
})
export class BillTableComponent   {
  @Input() data: any  = [];

 


}
