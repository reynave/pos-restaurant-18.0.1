import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy{
  env: any = environment;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'background-color', '#fff');

  }
  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'background-color', 'var(--bg-color-primary-1)');
  }
}
