import React, { useCallback } from 'react';
import { useLanguageStore, Language, SUPPORTED_LANGS } from './i18n';

const LANGS: Language[] = ['en', 'ru', 'uk', 'de', 'fr', 'es', 'it', 'zh'];

export const LanguageSelector: React.FC = () => {
  const { currentLang, setLanguage } = useLanguageStore();

  const onChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  }, [setLanguage]);

  return (
    <select
      value={currentLang}
      onChange={onChange}
      title="Change Language"
      className="fixed top-2 right-16 z-[9999] bg-white/10 backdrop-blur-md text-xs font-bold rounded px-2 py-1 cursor-pointer hover:bg-white/20 transition-all border-none outline-none text-current"
      style={{ WebkitAppearance: 'none', textAlign: 'center' }}
    >
      {LANGS.map(lang => (
        <option key={lang} value={lang} style={{ color: '#000' }}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
