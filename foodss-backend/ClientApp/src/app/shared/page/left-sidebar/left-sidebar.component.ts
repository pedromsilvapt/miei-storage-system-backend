import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {NavData} from './_nav';
import {DOCUMENT} from '@angular/common';
import {TranslationService} from 'angular-l10n';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html'
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;

  public navItems: NavData[] = [];
  public translationChangedSubscription: Subscription;

  constructor(private translationService: TranslationService, @Inject(DOCUMENT) document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });
    this.element = document.body;
    this.changes.observe(this.element as Element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnInit(): void {
    this.translationChangedSubscription = this.translationService.translationChanged().subscribe(lang => {
      this.navItems = [
        {
          title: true,
          name: 'Menu'
        },
        {
          name: this.translationService.translate('general.home'),
          url: '/',
          icon: 'icon-home'
        },
        {
          name: this.translationService.translate('general.storages'),
          url: '/storage-system/storage',
          icon: 'icon-drawer'
        }
      ];
    });
  }

  ngOnDestroy(): void {
    this.translationChangedSubscription.unsubscribe();
    this.changes.disconnect();
  }
}
