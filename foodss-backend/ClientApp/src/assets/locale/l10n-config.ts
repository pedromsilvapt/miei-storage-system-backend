import {L10nConfig, ProviderType, StorageStrategy} from 'angular-l10n';
import {Language} from 'angular-l10n/src/models/types';

export const languagesConfig: Array<any> = [
  { code: 'pt_pt', dir: 'ltr', title: 'Português', minTitle: 'PT' },
  { code: 'en', dir: 'ltr', title: 'English', minTitle: 'EN' }
];

const languages: Language[] = languagesConfig.map((language) => {
  return { code: language.code, dir: language.dir };
});

export const l10nConfig: L10nConfig = {
  locale: {
    languages,
    language: languagesConfig[0].code,
    storage: StorageStrategy.Cookie
  },
  translation: {
    providers: [
      { type: ProviderType.Static, prefix: '/assets/locale/locale-' }
    ],
    caching: true,
    composedKeySeparator: '.',
  }
};
