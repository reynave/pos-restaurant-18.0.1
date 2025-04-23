import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,  NgbDatepickerModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    public modalService: NgbModal, 
  ) { }
	

	open(content: any) {
		this.modalService.open(content,);
	}
}
