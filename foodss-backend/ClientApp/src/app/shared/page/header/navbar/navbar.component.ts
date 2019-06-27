import {Component, OnInit} from '@angular/core';
import { LoginService } from '../../../../login/login.service';
import { StorageInvitationModel } from './navbar.model';
import { HttpService } from '../../../../core/http/http.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public invitation: Array<StorageInvitationModel> = [];
  public totalinvites;

  constructor(private loginService: LoginService, protected httpService: HttpService) { }

   ngOnInit() {
    this.loginService.onLogin.subscribe(async user => {
      if (user != null) {
        this.invitation = await this.httpService.get('user/invitation').toPromise();
        this.totalinvites = this.invitation.length;
        console.log(this.invitation);
      }
      else {
        this.invitation = [];
      }
    });
   
  }

  public signOut() {
    this.loginService.signOut();
  }

  AcceptInvitation(storageid: number, state: number) {
    if (state == 0) {
      this.httpService.post('user/invitation/' + storageid + '/accept').toPromise();
    }
    else {
      this.httpService.post('user/invitation/' + storageid + '/reject').toPromise();
    }
  }

}
