// HOC для добавления поддержки перевода компонентам
import React from 'react';

// Константа на уровне модуля - создаётся один раз
const PROTECTED_KEYS = new Set([
    'url', 'image', 'src', 'imageUrl', 'bgImage',
    'avatar', 'images', 'logo', 'icon', 'photo', 'media'
]);

// Regex для проверки URL (быстрее чем 3 отдельных проверки)
const URL_PATTERN = /^(https?:|data:|[a-z]+:\/\/)/i;

// Проверка: является ли значение URL
const isUrl = (v: unknown): boolean =>
    typeof v === 'string' && URL_PATTERN.test(v);

// Рекурсивный переводчик данных
export const translateData = <T,>(data: T, lang = 'en'): T => {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
        return data.map(item => translateData(item, lang)) as T;
    }

    const src = data as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(src)) {
        const val = src[key];

        // Защищённые ключи или URL - копируем без изменений
        if (PROTECTED_KEYS.has(key) || isUrl(val)) {
            result[key] = val;
            continue;
        }

        // Рекурсия для объектов
        if (val && typeof val === 'object') {
            result[key] = translateData(val, lang);
            continue;
        }

        // Применяем перевод для не-английского языка (объединённый проход)
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

interface WithTranslationProps {
    currentLang?: string;
    localOverrides?: { data?: unknown };
}

// HOC для перевода localOverrides.data
export const withTranslation = <P extends WithTranslationProps>(
    Component: React.ComponentType<P>
): React.FC<P> => (props: P) => {
    const { currentLang = 'en', localOverrides, ...rest } = props;

    const translated = localOverrides?.data
        ? { ...localOverrides, data: translateData(localOverrides.data, currentLang) }
        : localOverrides;

    return <Component {...rest as P} currentLang={currentLang} localOverrides={translated} />;
};
