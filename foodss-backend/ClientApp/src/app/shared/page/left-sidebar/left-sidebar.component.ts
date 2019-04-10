import {Component, Inject, OnInit} from '@angular/core';
import {navItems} from './_nav';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {

  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;

  constructor(@Inject(DOCUMENT) document?: any) {

    this.changes = new MutationObserver(() => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });
    this.element = document.body;
    this.changes.observe(this.element as Element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnInit() {
  }

}
