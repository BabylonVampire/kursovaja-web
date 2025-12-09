import { ELocales } from '@/i18n';
import { create } from 'zustand';
import { DEFAULT_LANGUAGE, PREFERRED_LANGUAGE_KEY } from '../constants/Language.constants';
import { TLanguageStore } from '../types/TLanguageStore';

export const useLanguageStore = create<TLanguageStore>()((set) => ({
  currentLanguage: DEFAULT_LANGUAGE,
  setLanguage: (language: ELocales) => {
    set({ currentLanguage: language });
    localStorage.setItem(PREFERRED_LANGUAGE_KEY, language);
  },
}));
