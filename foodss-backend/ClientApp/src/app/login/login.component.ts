import {Component, OnInit} from '@angular/core';
import {Language} from 'angular-l10n';
import {LoginService} from './login.service';
import {MessageUtil} from '../shared/util/message.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  @Language() lang: string;

  public email: string;
  public password: string;

  constructor(private loginService: LoginService, private messageUtil: MessageUtil) {
  }

  ngOnInit() {
  }

  signIn() {
    this.loginService.signIn(this.email, this.password);
  }
}
