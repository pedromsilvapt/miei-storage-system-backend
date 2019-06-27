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

  async AcceptInvitation(storageid: number, state: number) {
    if (state == 0) {
      //await this.httpService.post('user/invitation/' + storageid + '/accept').toPromise();
    }
    else {
      //await this.httpService.post('user/invitation/' + storageid + '/reject').toPromise();
    }

    const index = this.invitation.findIndex(inv => inv.storageId == storageid);

    if (index >= 0) {
      this.invitation.splice(index, 1);

      this.totalinvites -= 1;
    }
  }

}
