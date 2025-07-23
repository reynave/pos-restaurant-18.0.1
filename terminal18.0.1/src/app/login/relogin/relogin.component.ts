import { Component } from '@angular/core';
import { UserLoggerService } from '../../service/user-logger.service';
import { Router } from '@angular/router';
import { ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-relogin',
  standalone: true,
  imports: [],
  templateUrl: './relogin.component.html',
  styleUrl: './relogin.component.css'
})
export class ReloginComponent {

  constructor(
    public configService: ConfigService,
    private router: Router,
    public logService: UserLoggerService

  ) { }
  logOff() {
    this.logService.logAction('Relogin')
    this.configService.isLogoff();
    this.configService.removeToken().subscribe(
      () => {
        this.router.navigate(['/']).then(
          () => location.reload()
        )
      }
    )

  }
}
