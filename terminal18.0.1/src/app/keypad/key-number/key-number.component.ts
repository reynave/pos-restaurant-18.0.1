import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-key-number',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-number.component.html',
  styleUrl: './key-number.component.css'
})
export class KeyNumberComponent {
  numberArray: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];
  @Output() dataEmitted = new EventEmitter<string>();

  sendData(data: string) {
    const message = data;
    this.dataEmitted.emit(data);
  }
}
