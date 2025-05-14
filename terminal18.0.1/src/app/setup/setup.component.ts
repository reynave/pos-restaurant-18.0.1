import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css'
})
export class SetupComponent {
  env : any = environment;
}
