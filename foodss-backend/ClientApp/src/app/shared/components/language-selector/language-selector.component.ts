import { Component, OnInit } from '@angular/core';
import {LocaleService} from 'angular-l10n';
import {languagesConfig} from '../../../../assets/locale/l10n-config';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html'
})
export class LanguageSelectorComponent implements OnInit {

  constructor(public locale: LocaleService) { }

  languagesConfig: Array<any>;
  currentLanguage: any;

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
