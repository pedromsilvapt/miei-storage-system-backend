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
import {PageFooterComponent} from './footer/page-footer.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { BreadcrumbComponent } from './header/breadcrumb/breadcrumb.component';
import {RouterModule} from '@angular/router';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BsDropdownModule} from 'ngx-bootstrap';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  declarations: [
    NavbarComponent,
    BreadcrumbComponent,
    PageFooterComponent,
    LeftSidebarComponent,
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
    BsDropdownModule,
    TranslationModule
  ],
  exports: [
    NavbarComponent,
    BreadcrumbComponent,
    PageFooterComponent,
    LeftSidebarComponent,
  ]
})
export class PageModule { }
