import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../../login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() { }

  public signOut() {
    this.loginService.signOut();
  }

}
