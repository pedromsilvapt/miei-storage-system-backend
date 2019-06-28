import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../model/user.model';
import {StepperComponent} from '../components/stepper/stepper.component';
import {Language} from 'angular-l10n';
import {UserRegisterDTO} from '../model/user-register.dto.model';
import {UserService} from '../user.service';
import {MessageUtil} from '../../shared/util/message.util';
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

  public user: User;
  
  constructor(private http : HttpService, private messageUtil: MessageUtil) { }

  async ngOnInit() {
    this.user = await this.http.get('user/session').toPromise();
  }

  async save() {
    if (this.user.password == this.user.passwordConfirm) {
      try {
        await this.http.post('user', {
          name: this.user.name,
          password: this.user.password,
          passwordConfirm: this.user.passwordConfirm,
        }).toPromise();

        this.messageUtil.addSuccessMessage("Perfil", "Perfil alterado.");
      } catch (err) {
        console.error(err);

        this.messageUtil.addErrorMessage("Perfil", "Erro ao alterar perfil.")
      }
    }
  }
}
