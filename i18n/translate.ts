// Translation utilities - consolidated from translationHelper.ts and withTranslation.tsx

import { PROTECTED_KEYS, URL_PATTERN } from './types';

type LangObj = Record<string, string>;

// Check if value is a URL
const isUrl = (v: unknown): boolean =>
    typeof v === 'string' && URL_PATTERN.test(v);

/**
 * Get translated text from a multi-language object or string
 */
export const getTranslatedText = (value: unknown, lang = 'en'): string => {
    if (!value) return '';
    if (typeof value === 'object' && !Array.isArray(value)) {
        const obj = value as LangObj;
        return obj[lang] || obj['en'] || Object.values(obj)[0] || '';
    }
    return String(value);
};

/**
 * Translate an array of items
 */
export const getTranslatedArray = <T extends Record<string, unknown>>(
    items: T[],
    lang = 'en'
): Record<string, string>[] => {
    if (!Array.isArray(items)) return [];
    return items.map(item => {
        if (typeof item !== 'object' || item === null) {
            return { value: getTranslatedText(item, lang) };
        }
        const result: Record<string, string> = {};
        for (const key in item) {
            result[key] = getTranslatedText(item[key], lang);
        }
        return result;
    });
};

/**
 * Recursively translate data object with flat key support (title_uk, etc.)
 */
export const translateData = <T,>(data: T, lang = 'en'): T => {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
        return data.map(item => translateData(item, lang)) as T;
    }

    const src = data as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(src)) {
        const val = src[key];

        // Protected keys or URLs - copy without changes
        if (PROTECTED_KEYS.has(key) || isUrl(val)) {
            result[key] = val;
            continue;
        }

        // Recursion for objects
        if (val && typeof val === 'object') {
            result[key] = translateData(val, lang);
            continue;
        }

        // Apply translation for non-English (flat keys like title_uk)
        if (lang !== 'en' && !key.includes('_')) {
            const langKey = `${key}_${lang}`;
            if (src[langKey]) {
                result[key] = src[langKey];
                continue;
            }
        }

        result[key] = val;
    }

    return result as T;
};
