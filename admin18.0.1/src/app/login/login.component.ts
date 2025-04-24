import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


export class Mylogin {
  constructor(
    public username: string,
    public password: string,
  ) { }
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
   model = new Mylogin('', '');

  onSubmit() {

  }
}
