import {NgModule} from '@angular/core';

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppFooterModule,
  AppHeaderModule,
  AppSidebarModule,
} from '@coreui/angular';

import {LeftSidebarComponent} from './left-sidebar/left-sidebar.component';
import {PageFooterComponent} from './footer/page-footer.component';
import {NavbarComponent} from './header/navbar/navbar.component';
import {BreadcrumbComponent} from './header/breadcrumb/breadcrumb.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {RightSidebarComponent} from './right-sidebar/right-sidebar.component';
import {SharedModule} from '../shared.module';

@NgModule({
  declarations: [
    NavbarComponent,
    BreadcrumbComponent,
    PageFooterComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
  ],
  imports: [
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    SharedModule
  ],
  exports: [
    NavbarComponent,
    BreadcrumbComponent,
    PageFooterComponent,
    LeftSidebarComponent,
  ]
})
export class PageModule { }
