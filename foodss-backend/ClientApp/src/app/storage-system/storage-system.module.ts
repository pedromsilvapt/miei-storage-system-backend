import {NgModule} from '@angular/core';
import {HomeModule} from '../home/home.module';
import {LoginModule} from '../login/login.module';
import {ProductModule} from '../product/product.module';
import {UserFormModule} from '../user/form/user-form.module';
import { StorageModule } from '../storage/storage.module';
import { AddStorageModule } from '../add-storage/add-storage.module';
import { ProfileFormModule } from '../user/profile/profile-form.module';



@NgModule({
  declarations: [],
  imports: [
    HomeModule,
    LoginModule,
    ProductModule,
    UserFormModule,
    StorageModule,
    AddStorageModule,
    ProfileFormModule
  ],
  exports: []
})
export class StorageSystemModule { }
