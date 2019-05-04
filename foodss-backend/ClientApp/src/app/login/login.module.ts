import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {SharedModule} from '../shared/shared.module';
import {LoginService} from './login.service';
import {AuthGuard} from './auth.guard';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
  ],
  providers: [LoginService, AuthGuard]
})
export class LoginModule { }
