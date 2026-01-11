// i18n Type Definitions

export type Language = 'en' | 'ru' | 'uk' | 'de' | 'fr' | 'es' | 'it' | 'zh';

export const SUPPORTED_LANGS: Language[] = ['en', 'ru', 'uk', 'de', 'fr', 'es', 'it', 'zh'];

export const LANGUAGE_NAMES: Record<Language, { name: string; native: string }> = {
    en: { name: 'English', native: 'English' },
    ru: { name: 'Russian', native: 'Русский' },
    uk: { name: 'Ukrainian', native: 'Українська' },
    de: { name: 'German', native: 'Deutsch' },
    fr: { name: 'French', native: 'Français' },
    es: { name: 'Spanish', native: 'Español' },
    it: { name: 'Italian', native: 'Italiano' },
    zh: { name: 'Chinese', native: '中文' }
};

// Protected keys that should never be translated (URLs, images, etc.)
export const PROTECTED_KEYS = new Set([
    'url', 'image', 'src', 'imageUrl', 'bgImage',
    'avatar', 'images', 'logo', 'icon', 'photo', 'media',
    'href', 'link', 'videoUrl', 'splineLink'
]);

// Regex for URL detection
export const URL_PATTERN = /^(https?:|data:|[a-z]+:\/\/)/i;
