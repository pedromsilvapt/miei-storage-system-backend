import { Component, OnInit } from '@angular/core';
import {LocaleService} from 'angular-l10n';
import {languagesConfig} from '../../../../../assets/locale/l10n-config';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public locale: LocaleService) { }

  languagesConfig: Array<any>;
  currentLanguage: string;

  ngOnInit() {
    this.languagesConfig = languagesConfig;
    this.updateCurrentLanguage();
  }

  public selectLanguage(language: string): void {
    this.locale.setCurrentLanguage(language);
    this.updateCurrentLanguage();
  }

  public updateCurrentLanguage() {
    this.currentLanguage = languagesConfig.find(languageConfig => languageConfig.code === this.locale.getCurrentLanguage());
  }

}
