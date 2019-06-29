import {Component, OnInit} from '@angular/core';
import { LoginService } from '../../../../login/login.service';
import { StorageInvitationModel } from './navbar.model';
import { HttpService } from '../../../../core/http/http.service'
import { interval } from 'rxjs';
import {StringUtil} from '../../../util/string-util';
import {AuthenticationUtil} from '../../../../core/util/authentication.util';
import { StorageModel } from 'src/app/storage/model/storage.model';
import { Product } from 'src/app/product/model/product.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public invitation: Array<StorageInvitationModel> = [];
  public weather: Array<Product>=[];
  public totalinvites;
  public totalstorageweather;
  public total;
  public userNameInitials = '';

  constructor(private loginService: LoginService, protected httpService: HttpService) { }

   ngOnInit() {
     this.userNameInitials = StringUtil.getInitials(AuthenticationUtil.getUserFromSession().name);
     this.loginService.onLogin.subscribe(async user => {
      if (user != null) {
        this.invitation = await this.httpService.get('user/invitation').toPromise();
        this.weather = await this.httpService.get('storage/weather').toPromise();
        this.totalstorageweather = this.weather.length;
        this.totalinvites = this.invitation.length;
        this.total = this.totalinvites + this.totalstorageweather;
        this.refresh();
      }
      else {
        this.invitation = [];
      }
    });

  }

  refresh() {
    interval(600000).subscribe(
      async (val) => {
        this.invitation = await this.httpService.get('user/invitation').toPromise();
        this.totalinvites = this.invitation.length;
      });
  }
  public signOut() {
    this.loginService.signOut();
  }

  async AcceptInvitation(storageid: number, state: number) {
    if (state == 0) {
      await this.httpService.post('user/invitation/' + storageid + '/accept').toPromise();
    }
    else {
      await this.httpService.post('user/invitation/' + storageid + '/reject').toPromise();
    }

    const index = this.invitation.findIndex(inv => inv.storageId == storageid);


    if (index >= 0) {
      this.invitation.splice(index, 1);

      this.totalinvites -= 1;
      this.total -= 1;
    }
  }

  async OK(number: number) {

 
    if (number == 1) {
      this.weather.splice(number, 1);
      this.totalstorageweather -= 1;
      this.total -= 1;
    }
  }

}
