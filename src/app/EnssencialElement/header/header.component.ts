import { Component, OnInit  } from '@angular/core';
import { LoginService } from '../../login_regester/service/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  login;
  type;
  constructor(private loginService: LoginService) {
    this.login = false;
    this.type = false;
  }
  ngOnInit(): void {
      this.loginService.IfLogin().subscribe({
        next: (login) => {
          if (login.length > 0) {
            this.login = true;
          if(login[0].type == 'admin'){
            this.type = true;
          }
      }}})
  }
}
