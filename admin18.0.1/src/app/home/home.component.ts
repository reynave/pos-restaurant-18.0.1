import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment.development';
import { FormsModule } from '@angular/forms';
export class Actor {
  constructor(
    public id: number,
    public name: string,
    public skill: string,
    public studio?: string,
  ) {}
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,  FormsModule, NgbDatepickerModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  env : any = environment;
  ver : string = environment.ver;
  constructor(
    public modalService: NgbModal, 
  ) { }
	
  model = new Actor(18, 'Tom Cruise', '', 'CW Productions');
  submitted = false;
  onSubmit() {
    this.submitted = true;
  }

	open(content: any) {
		this.modalService.open(content,);
	}
}
