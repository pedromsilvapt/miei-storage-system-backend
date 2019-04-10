import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import {PageFooterComponent} from './footer/page-footer.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { BreadcrumbComponent } from './header/breadcrumb/breadcrumb.component';
import {RouterModule} from '@angular/router';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {TabsModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    NavbarComponent,
    BreadcrumbComponent,
    PageFooterComponent,
    LeftSidebarComponent,
    RightSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    TabsModule.forRoot()
  ],
  exports: [
    NavbarComponent,
    BreadcrumbComponent,
    PageFooterComponent,
    LeftSidebarComponent,
    RightSidebarComponent
  ]
})
export class PageModule { }
