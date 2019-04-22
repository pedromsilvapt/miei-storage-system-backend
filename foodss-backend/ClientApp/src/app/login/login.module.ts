import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {SharedModule} from '../shared/shared.module';
import {LoginService} from './login.service';
import {AuthGuard} from './auth.guard';
import {MessageUtil} from '../shared/util/message.util';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
  ],
  providers: [LoginService, AuthGuard]
})
export class LoginModule { }
