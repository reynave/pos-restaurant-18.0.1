import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { KeyNumberComponent } from "../keypad/key-number/key-number.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../service/config.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, KeyNumberComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  env: any = environment;
  password: string = '';
  showKeyboard: boolean = false;
  getTokenJson: any = []
  warning : string = '';
  constructor(
       private router: Router,
    private renderer: Renderer2,
    public modalService: NgbModal,
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'background-color', '#fff');

  }
  ngOnInit(): void {
    this.getTokenJson = this.configService.getTokenJson() ?? [];
    this.renderer.setStyle(document.body, 'background-color', 'var(--bg-color-primary-1)');
  }

  ngAfterViewInit(){
    if(this.configService.getLogin() == '1'){
      this.router.navigate(['tables'])
    }
  }

  handleData(data: any) {
    if (data == 'b') {
      this.password = this.password.slice(0, -1);

    } else {
      this.password = this.password + data;
    }

  }

  open(content: any) {
    this.modalService.open(content, { size: 'sm' })
  }

  onSubmit() {
    const body = {
      username: this.configService.getTokenJson()['username'],
      password: this.password,
      outletId: this.configService.getConfigJson()['outlet']['id'],
    }
    const url = environment.api + "login/signin";
    this.http.post(url, body, {
      headers: this.configService.headers(),
    }).subscribe(
      data => {
        console.log(data);
        this.warning = '';
        this.modalService.dismissAll();
           this.configService.isLogin();
        this.router.navigate(['tables'])
      },
      error => {
        console.log(error);
       this.warning  = 'ERROR PASSWORD';
      }
    )
  }
}
