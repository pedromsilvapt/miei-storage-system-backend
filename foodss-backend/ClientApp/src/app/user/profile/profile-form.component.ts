import { Component, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';
import { MessageUtil } from '../../shared/util/message.util';
import { HttpService } from 'src/app/core/http/http.service';

interface User {
  email: string;
  name: string;
  password?: string;
  passwordConfirm?: string;
}

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {

  @Language() lang: string;

  public changePassword: boolean = false;

  public user: User;

  constructor(private http: HttpService, private messageUtil: MessageUtil) { }

  async ngOnInit() {
    this.user = await this.http.get('user/session').toPromise();
  }

  async save() {
    if (this.changePassword && this.user.password == this.user.passwordConfirm) {
      return;
    }

    if (this.changePassword && !this.user.password) {
      return;
    }

    try {
      await this.http.post('user', {
        name: this.user.name,
        password: this.changePassword ? this.user.password : null,
        passwordConfirm: this.changePassword ? this.user.passwordConfirm : null,
      }).toPromise();

      this.messageUtil.addSuccessMessage("Perfil", "Perfil alterado.");
    } catch (err) {
      console.error(err);

      this.messageUtil.addErrorMessage("Perfil", "Erro ao alterar perfil.");
    }
  }
}
