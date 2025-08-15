import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  TreeComponent,
  TreeModule,
  TreeNode,
} from '@ali-hm/angular-tree-component';
import { LoginComponent } from './login/login.component';
import { ConfigService } from './service/config.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterOutlet,
    RouterLink,
    TreeModule,
    LoginComponent,
    NgbNavModule,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild('treeComponent') tree!: TreeComponent;
  active = parseInt(localStorage.getItem('pos3.admin.tab') ?? '1');
  login: boolean = false;

  title = 'admin18.0.1';

  generalTab: any = [];
  reportTab: any = [];
  outletTab: any = [];
  menuTab: any = [];

  patch: string = '';

  options: any = {};
  version: string = environment.ver;
  constructor(
    private router: Router,
    private config: ConfigService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.checkLogin();
  }
  httpGet() {
    this.http
      .get<any>(environment.api + 'global/menu', {
        headers: this.config.headers(),
      })
      .subscribe((data) => {
        console.log(data);
        this.generalTab = data['generalTab'];

        this.outletTab = data['outletTab'];
        this.menuTab = data['menuTab'];
        this.reportTab = data['reportTab'];
        this.patch = data['patch'];
      });
  }

  checkLogin() {
    console.log('this.config.checkToken() ', this.config.checkToken());
    if (this.config.checkToken() == false) {
      this.router.navigate(['login']);
    } else {
      this.login = true;
      this.httpGet();
    }
  }
  saveActive(active: number) {
    localStorage.setItem('pos3.admin.tab', active.toString());
  }
  onEvent(data: any) {
    console.log('onEvent', data.node.data);
    if (data.node.data.href != '') {
      let params: any = data.node.data.params ? data.node.data.params : '';
      if (typeof params === 'string' && params.length > 2) {
        console.log(params);
        params = JSON.parse(params);
      }

      this.router.navigate([data.node.data.href], { queryParams: params });
    }
  }

  onLogout() {
    this.config.removeToken().subscribe((data) => {
      window.location.reload();
    });
  }

  onToggle(event: { node: TreeNode }) {
    const expandedNode = event.node;

    // Jika node baru di-expand (bukan di-collapse)
    if (expandedNode.isExpanded) {
      const siblings = expandedNode.parent
        ? expandedNode.parent.children
        : this.tree.treeModel.roots;

      siblings.forEach((node) => {
        // Tutup semua saudara kecuali node yang sedang di-expand
        if (node !== expandedNode && node.isExpanded) {
          node.collapse();
        }
      });
    }
  }
}
