import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { KeyNumberComponent } from "../keypad/key-number/key-number.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../service/config.service';
import { HttpClient } from '@angular/common/http';
import { UserLoggerService } from '../service/user-logger.service';
import { ViewTablesComponent } from "../pos/tables/view-tables/view-tables.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, KeyNumberComponent, ViewTablesComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('myInput') myInputRef!: ElementRef<HTMLInputElement>;
  env: any = environment;
  password: string = '';
  showKeyboard: boolean = false;
  getTokenJson: any = []
  ver: string = environment.ver;
  warning: string = '';

   intervalId: any;
  constructor(
    public logService: UserLoggerService,
    private router: Router,
    private renderer: Renderer2,
    public modalService: NgbModal,
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'background-color', '#fff');
      clearInterval(this.intervalId);

  }
  ngOnInit(): void {
    this.getTokenJson = this.configService.getTokenJson() ?? [];
      clearInterval(this.intervalId);
    this.renderer.setStyle(document.body, 'background-color', '#578FCA');
  }

  ngAfterViewInit() {
    if (this.configService.getLogin() == '1') {
      this.router.navigate(['tables'])
    }
    var self = this;
    this.intervalId = setInterval(function () {
      const inputElement = self.myInputRef.nativeElement;

      // Example: Set cursor at the beginning
      inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
      inputElement.focus();
    }, 1000)

  }



  handleData(data: any) {
    if (data == 'b') {
      this.password = this.password.slice(0, -1);

    } else {
      this.password = this.password + data;
    }

  }

  open(content: any) {
    this.logService.logAction('Log In')
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
        this.logService.logAction('Log In Success')
      },
      error => {
        console.log(error);
        this.warning = 'ERROR PASSWORD';
        this.logService.logAction('Log In ERROR PASSWORD')
      }
    )
  }
}
