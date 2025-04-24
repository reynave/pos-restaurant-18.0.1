import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TreeModule } from '@ali-hm/angular-tree-component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,TreeModule, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'admin18.0.1';
  nodes : any  = [
    {
      name: 'Root 123', icon:'<i class="bi bi-folder"></i>',
      children: [
        { name: 'Child 1', href: 'home', icon:'' },
        { name: 'Child 2', href: 'home2', icon:'' }
      ]
    }
  ];

  options : any = {};
}
