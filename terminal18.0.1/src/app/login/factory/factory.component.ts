import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-factory',
  standalone: true,
  imports: [],
  templateUrl: './factory.component.html',
  styleUrl: './factory.component.css'
})
export class FactoryComponent {
  constructor(
      private router: Router,
    ) { }
    
  resetdata() {
    localStorage.clear();
    setTimeout(()=>{
        this.router.navigate(['/']).then(()=>{
           location.reload();
        });
    },200)
  }

}
