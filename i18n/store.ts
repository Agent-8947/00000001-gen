// Language Store - consolidated from languageStore.ts

import { create } from 'zustand';
import { dictionary, TranslationKey } from './dictionary';
import type { Language } from './types';

interface LanguageStore {
    currentLang: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
    currentLang: 'en',
    setLanguage: (lang) => set({ currentLang: lang }),
    t: (key) => {
        const { currentLang } = get();
        return dictionary[currentLang][key];
    },
}));
