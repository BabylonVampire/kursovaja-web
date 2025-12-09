import { ELocales } from '@/i18n';

export type TLanguageStore = {
  currentLanguage: ELocales;
  setLanguage: (language: ELocales) => void;
};
